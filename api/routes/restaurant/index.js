const {
  storingData,
  getData,
  getTransactionData,
  getDataLoc,
  getPopularResto,
  getRestoByDishPrice,
  getRestoOpenHours,
  getOpenRestaurant
} = require('../../controllers/restaurant.controller');

const {
  popularRestoSchema,
  nearbyRestoSchema,
  restoByDishPrice,
  getTransactions,
  getRestoByOpeningHours,
  restaurantList,
  openRestoSchema
} = require('./schema');

const { importRestaurantSchema } = require('./importSchema');

module.exports = async (fastify) => {
  fastify.post('/', { schema: importRestaurantSchema }, storingData);
  fastify.get('/', { schema: restaurantList }, getData);
  fastify.get('/nearby', { schema: nearbyRestoSchema }, getDataLoc);
  fastify.get('/popular', { schema: popularRestoSchema }, getPopularResto);
  fastify.get(
    '/range-dish-price',
    { schema: restoByDishPrice },
    getRestoByDishPrice
  );
  fastify.get(
    '/total-opening',
    { schema: getRestoByOpeningHours },
    getRestoOpenHours
  );
  fastify.route({
    method: 'GET',
    url: '/transactions',
    schema: getTransactions,
    onRequest: fastify.auth([fastify.basicAuth]),
    handler: getTransactionData
  });
  fastify.get('/open', { schema: openRestoSchema }, getOpenRestaurant);
};
