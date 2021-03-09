const {
  storingData,
  getData,
  getTransactionData,
  getDataLoc,
  getPopularResto,
  getRestoByDishPrice,
  getRestoOpenHours
} = require('../controllers/restaurant.controller');

module.exports = async (fastify) => {
  fastify.post('/', storingData);
  fastify.get('/', getData);
  fastify.get('/transactions', getTransactionData);
  fastify.get('/nearby', getDataLoc);
  fastify.get('/popular', getPopularResto);
  fastify.get('/range-dish-price', getRestoByDishPrice);
  fastify.get('/open-week-hour', getRestoOpenHours);
};
