function errorHandler(error, req, res, next) {
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    const stack = process.env.NODE_ENV === 'production'? '🥞' : error.stack;

    res.status(status).json({  message, stack  });
}

module.exports = errorHandler;