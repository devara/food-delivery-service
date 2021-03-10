const {
  searchData,
  searchResto
} = require('../../controllers/search.controller');

const { searchSchema, searchRestobyDishSchema } = require('./schema');

module.exports = async (fastify) => {
  fastify.get('/', { schema: searchSchema }, searchData);
  fastify.get(
    '/resto-has-dish',
    { schema: searchRestobyDishSchema },
    searchResto
  );
};
