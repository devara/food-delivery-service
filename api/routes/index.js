const apiRoutes = async (app) => {
  app.register(require('./restaurant'), { prefix: 'restaurant' });
  app.register(require('./user'), { prefix: 'user' });
  app.register(require('./search'), { prefix: 'search' });
  app.register(require('./transaction'), { prefix: 'transaction' });
  app.get('/', async (request, reply) => {
    return {
      message: 'Fastify API is on fire'
    };
  });
};

module.exports = apiRoutes;
