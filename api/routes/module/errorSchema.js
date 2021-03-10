const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const unauthorized = {
  [StatusCodes.UNAUTHORIZED]: {
    description: 'Error: Unauthorized',
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  }
};

const notFound = {
  [StatusCodes.NOT_FOUND]: {
    description: ReasonPhrases.NOT_FOUND,
    type: 'object',
    properties: {
      message: { type: 'string' }
    }
  }
};

module.exports = {
  unauthorized,
  notFound
};
