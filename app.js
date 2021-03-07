const config = require('config');
const fastifyConfig = Object.assign({}, config.get('fastify'));
const Fastify = require('fastify');
const helmet = require('fastify-helmet');
const { connectDB } = require('./api/db');

const server = Fastify(fastifyConfig);

module.exports = { server };

(async () => {
  try {
    /**
     * Connect to mongoDB
     */
    await connectDB();

    server.register(helmet);
    /**
     * Register all routes
     */
    server.register(require('./api/routes'));
    await server.listen(3000, (err) => {
      if (err) {
        server.log.error(err);
        console.log(err);
        process.exit(1);
      }
      server.log.info('Server Started');
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
})();
