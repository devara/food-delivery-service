const fastify = require('fastify')({
  logger: {
    prettyPrint: {
      colorize: true,
      levelFirst: true,
      ignore: 'time,pid,hostname'
    }
  }
});

/**
 * @param message
 * @param error
 * @param additionalData
 */
const logErrDetails = ({ message = '', error = {}, additionalData }) => {
  fastify.log.error(error, message, additionalData);
};

/**
 *
 * @param message
 * @param additionalData
 */
const logInfoDetails = ({ message = '', additionalData = {} }) => {
  fastify.log.info(message, additionalData);
};

module.exports = { logErrDetails, logInfoDetails };
