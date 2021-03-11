const { StatusCodes } = require('http-status-codes');
const { unauthorized } = require('../module/errorSchema');
const dateRangeQuery = {
  fromDate: {
    type: 'string',
    description: 'Format YYYY-MM-DD'
  },
  toDate: {
    type: 'string',
    description: 'Format YYYY-MM-DD'
  }
};

const userDataResponse = {
  range: { type: 'string' },
  count: { type: 'number' },
  data: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        total_transactions: { type: 'number' },
        list: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              dish: { type: 'string' },
              amount: { type: 'number' },
              restaurant: { type: 'string' },
              date: { type: 'string' }
            }
          }
        }
      }
    }
  }
};

const topUserSchema = {
  description:
    'If you want to get TOP X users by total transactions within a date range.\r\nThis endpoint will return users name with total transactions and transaction lists.',
  summary: 'Top X User by Total Transaction',
  tags: ['user'],
  query: {
    type: 'object',
    properties: {
      ...dateRangeQuery,
      limit: {
        type: 'number',
        description: 'limit data you want to display, default is 10'
      }
    },
    required: ['fromDate', 'toDate']
  },
  response: {
    [StatusCodes.OK]: {
      description: 'Successful response',
      type: 'object',
      properties: userDataResponse
    }
  }
};

const userByTransactionAmount = {
  description:
    'You can find total users who made transactions above or below amount within a date range.',
  summary: 'Total User by Transaction',
  tags: ['user'],
  query: {
    type: 'object',
    properties: {
      ...dateRangeQuery,
      operator: {
        type: 'string',
        description: 'above or below (default is above)'
      },
      amount: {
        type: 'number',
        description: 'total amount'
      }
    },
    required: ['fromDate', 'toDate', 'amount']
  },
  response: {
    [StatusCodes.OK]: {
      description: 'Successful response',
      type: 'object',
      properties: userDataResponse
    }
  }
};

const getUserTransactions = {
  description:
    'This enpoint will return user transactions list based user name or slug you entered. You need to authorize with username and password. Use user slug for username, and for password please using hungry12345678.',
  summary: 'User Transactions List',
  tags: ['transaction'],
  query: {
    type: 'object',
    properties: {
      slug: {
        type: 'string',
        description: 'user slug, e.g don-reichert'
      }
    },
    required: ['slug']
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
              amount: { type: 'number' },
              dish: { type: 'string' },
              restaurant: {
                type: 'object',
                properties: {
                  name: { type: 'string' }
                }
              },
              date: { type: 'string' }
            }
          }
        }
      }
    },
    ...unauthorized
  }
};

const userList = {
  description: 'You can use this endpoint to show user list.',
  summary: 'User List',
  tags: ['user'],
  query: {
    type: 'object',
    properties: {
      page: { type: 'number' },
      limit: {
        type: 'number',
        description: 'default is 10'
      }
    }
  },
  response: {
    [StatusCodes.OK]: {
      description: 'Successful response',
      type: 'object',
      properties: {
        page: { type: 'number' },
        show: { type: 'number' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              slug: { type: 'string' },
              balance: { type: 'number' },
              location: {
                type: 'object',
                properties: {
                  coordinates: { type: 'array' }
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = {
  topUserSchema,
  userByTransactionAmount,
  getUserTransactions,
  userList
};
