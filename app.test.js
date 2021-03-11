'use strict';

const { test } = require('tap');
const supertest = require('supertest');

const { createServer } = require('./api/server');
test('GET routes', async (t) => {
  const fastify = await createServer();

  await fastify.ready();

  const response = await supertest(fastify.server)
    .get('/api/v1/')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  t.strictEqual(response.statusCode, 200);
  t.strictEqual(
    response.headers['content-type'],
    'application/json; charset=utf-8'
  );
  t.deepEqual(response.body, { message: 'Fastify API is on fire' });

  const getResto = await supertest(fastify.server)
    .get('/api/v1/restaurant?page=1&limit=2')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  t.strictEqual(getResto.statusCode, 200);
  t.strictEqual(
    getResto.headers['content-type'],
    'application/json; charset=utf-8'
  );
  t.strictEqual(getResto.body.page, 1);
  t.strictEqual(getResto.body.show, 2);
  t.strictEqual(getResto.body.data.length, 2);

  const getPopularResto = await supertest(fastify.server)
    .get('/api/v1/restaurant/popular?limit=2')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  t.strictEqual(getPopularResto.statusCode, 200);
  t.strictEqual(
    getPopularResto.headers['content-type'],
    'application/json; charset=utf-8'
  );
  t.strictEqual(getPopularResto.body.count, 2);
  t.strictEqual(getPopularResto.body.data.length, 2);

  const getNearbyResto = await supertest(fastify.server)
    .get(
      '/api/v1/restaurant/nearby?longitude=115.228221&latitude=-8.640233&maxDistance=1000'
    )
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  t.strictEqual(getNearbyResto.statusCode, 200);
  t.strictEqual(
    getNearbyResto.headers['content-type'],
    'application/json; charset=utf-8'
  );
  t.strictNotSame(getNearbyResto.body.count, 0);
  t.strictNotSame(getNearbyResto.body.data.length, 0);

  const searchRestoAndDish = await supertest(fastify.server)
    .get('/api/v1/search/?words=house')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  t.strictEqual(searchRestoAndDish.statusCode, 200);
  t.strictEqual(
    searchRestoAndDish.headers['content-type'],
    'application/json; charset=utf-8'
  );
  t.strictNotSame(searchRestoAndDish.body.count, 0);
  t.strictNotSame(searchRestoAndDish.body.data.length, 0);

  const searchRestoBydDishName = await supertest(fastify.server)
    .get('/api/v1/search/resto-has-dish?words=Funfetti&limit=5')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  t.strictEqual(searchRestoBydDishName.statusCode, 200);
  t.strictEqual(
    searchRestoBydDishName.headers['content-type'],
    'application/json; charset=utf-8'
  );
  t.strictEqual(searchRestoBydDishName.body.count, 5);
  t.strictEqual(Array.isArray(searchRestoBydDishName.body.data), true);
  t.strictNotSame(searchRestoBydDishName.body.data.length, 0);

  const restoByDishPrice = await supertest(fastify.server)
    .get('/api/v1/restaurant/range-dish-price?minPrice=25&maxPrice=50&limit=5')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  t.strictEqual(restoByDishPrice.statusCode, 200);
  t.strictEqual(
    restoByDishPrice.headers['content-type'],
    'application/json; charset=utf-8'
  );
  t.strictEqual(restoByDishPrice.body.count, 5);
  t.strictEqual(Array.isArray(restoByDishPrice.body.data), true);
  t.strictNotSame(restoByDishPrice.body.data.length, 0);

  const topUser = await supertest(fastify.server)
    .get('/api/v1/user/top?fromDate=2020-05-20&toDate=2020-05-28&limit=5')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  t.strictEqual(topUser.statusCode, 200);
  t.strictEqual(
    topUser.headers['content-type'],
    'application/json; charset=utf-8'
  );
  t.strictEqual(topUser.body.count, 5);
  t.strictEqual(Array.isArray(topUser.body.data), true);
  t.strictEqual(topUser.body.data.length, 5);

  const getUserTransNotAuthorized = await supertest(fastify.server)
    .get('/api/v1/user/transactions?slug=don-reichert')
    .expect(401)
    .expect('Content-Type', 'application/json; charset=utf-8');
  t.strictEqual(getUserTransNotAuthorized.statusCode, 401);
  t.strictEqual(
    getUserTransNotAuthorized.headers['content-type'],
    'application/json; charset=utf-8'
  );
  t.strictEqual(getUserTransNotAuthorized.body.error, 'Unauthorized');

  const getUserTransAuthorized = await supertest(fastify.server)
    .get('/api/v1/user/transactions?slug=don-reichert')
    .auth('don-reichert', 'hungry12345678')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  t.strictEqual(getUserTransAuthorized.statusCode, 200);
  t.strictEqual(Array.isArray(getUserTransAuthorized.body.data), true);

  t.tearDown(() => {
    console.log('TEST IS DONE');
    fastify.close();
    process.exit(0);
  });
});
