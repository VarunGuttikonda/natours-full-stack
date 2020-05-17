const path = require('path'); //Node Path module
const express = require('express'); //Express Framework
const morgan = require('morgan'); //Developer Logging
const rateLimit = require('express-rate-limit'); //IP request rate limiting
const helmet = require('helmet'); //Req headers
const mongoSanitize = require('express-mongo-sanitize'); //Sanitize data from malicious code for MongoDB
const xss = require('xss-clean'); //Remove XSS scripting
const hpp = require('hpp'); //Parameter Pollution Prevent
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRouter');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serve static files
app.use(express.static(path.join(__dirname, 'public')));

//Secure HTTP headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit Requests per IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour',
});

app.use('/api', limiter);

//Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Sanitize data for NoSQL attacks
app.use(mongoSanitize());

//Sanitize data for XSS attacks
app.use(xss());

//Whitelist some params from Parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuatity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//All the Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Cant't find ${req.originalUrl} on this server`), 404);
});

//Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
