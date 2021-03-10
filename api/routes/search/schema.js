const { StatusCodes } = require('http-status-codes');
const { notFound } = require('../module/errorSchema');

const searchSchema = {
  description:
    'If you want to search for a restaurant or dish by name, you can enter a keyword. The results will be sorted based on the scores of the relevant search terms.',
  summary: 'Search Resto or Dish by Name',
  tags: ['search'],
  querystring: {
    type: 'object',
    properties: {
      words: { type: 'string', description: 'keywords (not case sensitive)' }
    },
    required: ['words']
  },
  response: {
    [StatusCodes.OK]: {
      description: 'Successful response',
      type: 'object',
      properties: {
        count: { type: 'number' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'resto name (orange house) or dish name (caramel)'
              },
              searchScore: { type: 'number' },
              type: { type: 'string', example: 'restaurant or dish' },
              restaurant: {
                type: 'string',
                description: 'will display if type is dish'
              }
            }
          }
        }
      }
    },
    ...notFound
  }
};

const searchRestobyDishSchema = {
  description:
    'If a user wants to search for a restaurant that has the dish he wants, you can search for a dish by its name. The results will be sorted based on the scores of the relevant search terms.',
  summary: 'Search Resto that has Dish',
  tags: ['search'],
  querystring: {
    type: 'object',
    properties: {
      words: {
        type: 'string',
        description: 'keywords (not case sensitive)'
      },
      limit: {
        type: 'number',
        description: 'limit data you want to display, default is 50'
      }
    },
    required: ['words']
  },
  response: {
    [StatusCodes.OK]: {
      description: 'Successful response',
      type: 'object',
      properties: {
        count: { type: 'number' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'resto name (orange house)'
              },
              dish_lists: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' }
                  }
                }
              },
              totalDish: { type: 'number' }
            }
          }
        }
      }
    },
    ...notFound
  }
};

module.exports = {
  searchSchema,
  searchRestobyDishSchema
};
