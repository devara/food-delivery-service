const mongoose = require('mongoose');
const config = require('config');
const { MONGO_CONNECTED, MONGO_NOT_CONNECTED } = require('../constants');
const { logInfoDetails, logErrDetails } = require('../helpers/logger');
const mongoConfing = config.get('mongo');
const connectDB = async () => {
  try {
    await mongoose.connect(mongoConfing.url, mongoConfing.options);
    logInfoDetails({
      message: MONGO_CONNECTED
    });
  } catch (error) {
    logErrDetails({
      error,
      message: MONGO_NOT_CONNECTED
    });
  }
};

const checkHealtDB = async () => {
  if (mongoose && mongoose.connection && mongoose.connection.readyState) {
    return MONGO_CONNECTED;
  }

  connectDB();

  return null;
};

module.exports = { connectDB, checkHealtDB };
