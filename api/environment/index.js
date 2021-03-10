const env = process.env;
const dotenv = require('dotenv');

dotenv.config();

const environment = {
  NODE_ENV: env.NODE_ENV,
  APP_PORT: env.APP_PORT,
  /* if we prefer to using mongodb with full URL, like using mongodb cloud */
  MONGODB_URL: env.MONGODB_URL,
  /* DATABASE */
  MONGODB_HOST: env.MONGODB_HOST,
  MONGODB_USERNAME: env.MONGODB_USERNAME,
  MONGODB_PASSWORD: env.MONGODB_PASSWORD,
  MONGODB_DATABASE: env.MONGODB_DATABASE
};

module.exports = environment;
