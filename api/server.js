const { NODE_ENV } = require('./environment');
const Fastify = require('fastify');
const helmet = require('fastify-helmet');

const logger = {
  development: {
    prettyPrint: {
      colorize: true,
      levelFirst: true,
      ignore: 'time,pid,hostname'
    }
  },
  production: {
    formatters: {
      level(level) {
        return { level };
      }
    },
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
  }
};

const createServer = async () => {
  const server = Fastify({
    bodyLimit: 1048576 * 3,
    logger: logger[NODE_ENV],
    ignoreTrailingSlash: true
  });

  await server.register(require('./db'));

  await server.register(helmet);

  await server.register(require('./routes'), { prefix: 'api/v1' });

  return server;
};

module.exports = {
  createServer
};
