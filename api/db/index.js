const mongoose = require('mongoose');
const fastifyPlugin = require('fastify-plugin');
const { MONGO_CONNECTED, MONGO_NOT_CONNECTED } = require('../constants');
const { logInfoDetails, logErrDetails } = require('../helpers/logger');
const {
  MONGODB_URL,
  MONGODB_HOST,
  MONGODB_DATABASE,
  MONGODB_USERNAME,
  MONGODB_PASSWORD
} = require('../environment');
const connectDB = async (fastify, options, next) => {
  try {
    const url = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE}?authSource=${MONGODB_DATABASE}&retryWrites=true`;
    await mongoose
      .connect(MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      .then((db) => {
        logInfoDetails({
          message: MONGO_CONNECTED
        });
        fastify.decorate('mongo', db);
      })
      .catch((err) => {
        logErrDetails({
          err,
          message: MONGO_NOT_CONNECTED
        });
      });
  } catch (error) {
    logErrDetails({
      error,
      message: MONGO_NOT_CONNECTED
    });
  }

  next();
};

module.exports = fastifyPlugin(connectDB);
