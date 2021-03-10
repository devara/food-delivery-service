const {
  storeData,
  getUserList,
  getTop,
  getUserbyTransAmount,
  getTransactions
} = require('../../controllers/user.controller');

const {
  topUserSchema,
  userByTransactionAmount,
  getUserTransactions,
  userList
} = require('./schema');

const { importUserSchema } = require('./importSchema');

module.exports = async (fastify) => {
  fastify.post('/', { schema: importUserSchema }, storeData);
  fastify.get('/', { schema: userList }, getUserList);
  fastify.get('/top', { schema: topUserSchema }, getTop);
  fastify.get(
    '/by-trans-amount',
    { schema: userByTransactionAmount },
    getUserbyTransAmount
  );
  fastify.route({
    method: 'GET',
    url: '/transactions',
    schema: getUserTransactions,
    onRequest: fastify.auth([fastify.basicAuth]),
    handler: getTransactions
  });
};
