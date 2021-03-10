const { ReasonPhrases, StatusCodes } = require('http-status-codes');
const {
  addResto,
  getResto,
  getRestoByLoc,
  restoHasDishwithPriceRange,
  restoOpenHours,
  getOpenResto
} = require('../services/restaurant.service');

const {
  restoTransactions,
  popularRestoByTransactions
} = require('../services/transaction.service');

const storingData = async (request, reply) => {
  try {
    const result = await addResto(request);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getData = async (request, reply) => {
  try {
    const result = await getResto(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getTransactionData = async (request, reply) => {
  try {
    const result = await restoTransactions(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getPopularResto = async (request, reply) => {
  try {
    const result = await popularRestoByTransactions(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getDataLoc = async (request, reply) => {
  try {
    const result = await getRestoByLoc(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getRestoByDishPrice = async (request, reply) => {
  try {
    const result = await restoHasDishwithPriceRange(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getRestoOpenHours = async (request, reply) => {
  try {
    const result = await restoOpenHours(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getOpenRestaurant = async (request, reply) => {
  try {
    const result = await getOpenResto(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  storingData,
  getData,
  getTransactionData,
  getDataLoc,
  getPopularResto,
  getRestoByDishPrice,
  getRestoOpenHours,
  getOpenRestaurant
};
