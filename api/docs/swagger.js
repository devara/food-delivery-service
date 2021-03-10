exports.options = {
  routePrefix: '/docs',
  // yaml: true,
  exposeRoute: true,
  swagger: {
    swagger: '2.0',
    info: {
      version: '1.0',
      title: 'Food App',
      contact: {}
    },
    host: '127.0.0.1:3000',
    securityDefinitions: {
      basicAuth: {
        type: 'http',
        scheme: 'basic'
      }
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    security: [
      {
        basicAuth: []
      }
    ]
  }
};
