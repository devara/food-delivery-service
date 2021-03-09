const { ReasonPhrases, StatusCodes } = require('http-status-codes');
const { createUserTransaction } = require('../services/transaction.service');

const purchaseMenu = async (request, reply) => {
  try {
    const result = await createUserTransaction(request.body);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { purchaseMenu };
