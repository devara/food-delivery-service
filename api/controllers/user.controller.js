const { ReasonPhrases, StatusCodes } = require('http-status-codes');
const { addUser, getUsers } = require('../services/user.service');

const {
  userTransactions,
  topPurchaseUser,
  userByTransactionAmount
} = require('../services/transaction.service');

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

const getUserList = async (request, reply) => {
  try {
    const result = await getUsers(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getTop = async (request, reply) => {
  try {
    const result = await topPurchaseUser(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getUserbyTransAmount = async (request, reply) => {
  try {
    const result = await userByTransactionAmount(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getTransactions = async (request, reply) => {
  try {
    const result = await userTransactions(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  storeData,
  getUserList,
  getTop,
  getUserbyTransAmount,
  getTransactions
};
