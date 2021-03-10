const apiRoutes = async (app) => {
  app.register(require('./restaurant'), { prefix: 'restaurant' });
  app.register(require('./user'), { prefix: 'user' });
  app.register(require('./search'), { prefix: 'search' });
  app.register(require('./transaction'), { prefix: 'transaction' });
};

module.exports = apiRoutes;
