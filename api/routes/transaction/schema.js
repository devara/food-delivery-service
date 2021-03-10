const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { unauthorized } = require('../module/errorSchema');

const purchaseSchema = {
  description: 'You can use this endpoint to create transaction for the user.',
  summary: 'Create Transaction',
  tags: ['transaction'],
  body: {
    type: 'object',
    properties: {
      user: { type: 'string' },
      restaurant: { type: 'string' },
      dish: { type: 'string' }
    },
    example: {
      user: 'don-reichert',
      restaurant: 'orange-house',
      dish: 'kiwiberries'
    }
  },
  response: {
    [StatusCodes.OK]: {
      description: 'Successful response',
      type: 'object',
      properties: {
        msg: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            previousBalance: { type: 'number' },
            currentBalance: { type: 'number' }
          }
        }
      }
    },
    [StatusCodes.EXPECTATION_FAILED]: {
      description: ReasonPhrases.EXPECTATION_FAILED,
      type: 'object',
      properties: {
        msg: { type: 'string', example: 'Your balance is not enough!' },
        data: {
          type: 'object',
          properties: {
            currentBalance: { type: 'number' },
            dish_price: { type: 'number' }
          }
        }
      }
    },
    ...unauthorized
  }
};

module.exports = { purchaseSchema };
