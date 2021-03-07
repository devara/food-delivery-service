const { ReasonPhrases, StatusCodes } = require('http-status-codes');
const {
  addResto,
  getResto,
  getRestoByLoc,
  getTransactions,
  popularRestaurant,
  restoHasDishwithPriceRange
} = require('../services/restaurant.service');

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
    const result = await getResto(request);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getTransactionData = async (request, reply) => {
  try {
    const result = await getTransactions(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const getPopularResto = async (request, reply) => {
  try {
    const result = await popularRestaurant(request.query);
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

module.exports = {
  storingData,
  getData,
  getTransactionData,
  getDataLoc,
  getPopularResto,
  getRestoByDishPrice
};
