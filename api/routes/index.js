const apiRoutes = async (app) => {
  app.register(require('./restaurant'), { prefix: 'restaurant' });
  app.register(require('./user'), { prefix: 'user' });
  app.register(require('./search'), { prefix: 'search' });
};

module.exports = apiRoutes;
