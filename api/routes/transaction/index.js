const { purchaseMenu } = require('../../controllers/transaction.controller');

const { purchaseSchema } = require('./schema');

module.exports = async (fastify) => {
  // fastify.post('/', { schema: purchaseSchema }, purchaseMenu);
  fastify.route({
    method: 'POST',
    url: '/create',
    schema: purchaseSchema,
    onRequest: fastify.auth([fastify.basicAuth]),
    handler: purchaseMenu
  });
};
