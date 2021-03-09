const { purchaseMenu } = require('../controllers/transaction.controller');

module.exports = async (fastify) => {
  fastify.post('/', purchaseMenu);
};
