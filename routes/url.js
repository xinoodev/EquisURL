const express = require('express');
const { nanoid } = require('nanoid');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const path = require('path');
const { urls } = require('../config/database');
const schema = require('../config/schema');

const router = express.Router();

const notFoundPath = path.join(__dirname, '../../public/404.html');

router.get('/:id', async (req, res, next) => {
  const { id: slug } = req.params;
  try {
    const url = await urls.findOne({ slug });
    if (url) {
      return res.redirect(url.url);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

router.post('/url', slowDown({
  windowMs: 30 * 1000,
  delayAfter: 2,
  delayMs: 500,
}), rateLimit({
  windowMs: 30 * 1000,
  max: 3,
}), async (req, res, next) => {
  let { slug, url } = req.body;
  try {
    await schema.validate({
      slug,
      url,
    });
    if (url.includes('xshorturl')) {
      throw new Error('🛑 ERROR 🛑');
    }
    if (!slug) {
      slug = nanoid(5);
    } else {
      const existing = await urls.findOne({ slug });
      if (existing) {
        throw new Error('Apodo en uso. 🌹');
      }
    }
    slug = slug.toLowerCase();
    const newUrl = {
      url,
      slug,
    };
    const created = await urls.insert(newUrl);
    res.json(created);
  } catch (error) {
    next(error);
  }
});

module.exports = router;