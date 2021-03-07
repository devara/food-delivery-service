const {
  storeData,
  getTop,
  getUserbyTransAmount,
  getTransactions
} = require('../controllers/user.controller');

module.exports = async (fastify) => {
  fastify.post('/', storeData);
  fastify.get('/top', getTop);
  fastify.get('/by-trans-amount', getUserbyTransAmount);
  fastify.get('/transactions', getTransactions);
};
