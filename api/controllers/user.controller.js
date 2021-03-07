const { ReasonPhrases, StatusCodes } = require('http-status-codes');
const {
  addUser,
  getTopPurchase,
  getUserByTransactionAmount,
  transactionList
} = require('../services/user.service');

const storeData = async (request, reply) => {
  try {
    const result = await addUser(request);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getTop = async (request, reply) => {
  try {
    const result = await getTopPurchase(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getUserbyTransAmount = async (request, reply) => {
  try {
    const result = await getUserByTransactionAmount(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getTransactions = async (request, reply) => {
  try {
    const result = await transactionList(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { storeData, getTop, getUserbyTransAmount, getTransactions };
