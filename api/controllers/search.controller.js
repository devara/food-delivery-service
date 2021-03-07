const { ReasonPhrases, StatusCodes } = require('http-status-codes');
const {
  restoAndMenuSearch,
  restoHasDish
} = require('../services/search.service');

const searchData = async (request, reply) => {
  try {
    const result = await restoAndMenuSearch(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const searchResto = async (request, reply) => {
  try {
    const result = await restoHasDish(request.query);
    reply.code(result.status).send(result.payload);
  } catch (error) {
    reply
      .code(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { searchData, searchResto };
