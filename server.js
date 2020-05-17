const mongoose = require('mongoose');

const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION..... Shutting Down.....');
  console.log(err, ' ', err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE_STRING.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to Database Successfully'))
  .catch((err) => {
    console.log(err, ' will be resolved');
  });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App listening on ${PORT}.....`);
  console.log('Running Environment: ', process.env.NODE_ENV);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION..... Shutting Down.....');
  console.log(err.name, ' ', err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('🤞 SIGTERM RECEIVED. Shutting down gracefully.');

  server.close(() => {
    console.log('💥 Process Terminated');
  });
});
