const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}.Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input Data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token.Please login again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your Token has expired.Please login again!', 401);

// eslint-disable-next-line no-unused-vars
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
  return res
    .status(err.statusCode)
    .render('error', { title: 'Something went wrong', msg: err.message });
};

const sendErrorProduction = (err, req, res) => {
  //API Error
  if (req.originalUrl.startsWith('/api')) {
    //Operational,Trusted Error
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.meassage,
      });
    }
    // eslint-disable-next-line no-console
    console.log('ERROR:Something wrong had happenend', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }

  //For rendered Website
  if (err.isOperational) {
    console.log(err);
    return res
      .status(err.statusCode)
      .render('error', { title: 'Something went wrong', msg: err.message });
  }
  // eslint-disable-next-line no-console
  console.log('ERROR:Something wrong had happenend', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProduction(error, req, res);
  }
};

/*
Possible MongoDB Errors which are marked as Operational Errors:
1) Validation Error
2) Duplicate Key Error
3) Range or Schema Error
*/
