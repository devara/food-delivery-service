const { searchData, searchResto } = require('../controllers/search.controller');

module.exports = async (fastify) => {
  fastify.get('/', searchData);
  fastify.get('/resto-has-dish', searchResto);
};
