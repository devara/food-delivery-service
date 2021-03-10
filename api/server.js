const { NODE_ENV } = require('./environment');
const Fastify = require('fastify');
const swaggerDocs = require('./docs/swagger');
const { validate } = require('./services/auth.service');

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

  await server.register(require('fastify-helmet'), {
    contentSecurityPolicy: {
      directives: {
        baseUri: ["'self'"],
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'self'"],
        workerSrc: ["'self'", 'blob:'],
        frameSrc: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: []
      }
    }
  });

  await server.register(require('fastify-cors'), { origin: '*' });

  await server.register(require('fastify-oas'), swaggerDocs.options);

  await server.register(require('fastify-auth'));

  await server.register(require('fastify-basic-auth'), { validate });

  await server.register(require('./routes'), { prefix: 'api/v1' });

  return server;
};

module.exports = {
  createServer
};
