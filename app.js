const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const urlRoutes = require('./routes/url');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.enable('trust proxy');
app.use(helmet());
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('./public'));

app.use('/', urlRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

app.use(errorHandler);

module.exports = app;