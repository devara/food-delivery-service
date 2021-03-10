const { StatusCodes } = require('http-status-codes');
const { unauthorized, notFound } = require('../module/errorSchema');

const popularRestoSchema = {
  description:
    'With this endpoint, you cand find the popular restaurants by transactions volume, , either by number of transactions or transaction amount.',
  summary: 'Popular Restaurant',
  tags: ['restaurant'],
  query: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'limit data you want to display, default is 50'
      }
    }
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
              transactionCount: { type: 'number' },
              totalAmount: { type: 'number' }
            }
          }
        }
      }
    }
  }
};

const nearbyRestoSchema = {
  description:
    'You can find the nearest restaurant by location (use longitude and latitude). You will get a list of restaurants with distances in meters and kilometers based on the location you entered',
  summary: 'List Resto by Distance',
  tags: ['restaurant'],
  query: {
    type: 'object',
    properties: {
      longitude: {
        type: 'number',
        description: 'longitude value, e.g 115.228221'
      },
      latitude: {
        type: 'number',
        description: 'latitude value, e.g -8.640233'
      },
      maxDistance: {
        type: 'number',
        description: 'max distance you want, e.g 1000 (in meters)'
      }
    },
    required: ['longitude', 'latitude', 'maxDistance']
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
              distance: {
                type: 'object',
                properties: {
                  meters: {
                    type: 'object',
                    properties: {
                      value: { type: 'number' },
                      label: { type: 'string' }
                    }
                  },
                  kilometers: {
                    type: 'object',
                    properties: {
                      value: { type: 'number' },
                      label: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    ...notFound
  }
};

const restoByDishPrice = {
  description:
    'This endpoint can be used to find restaurants that have dishes within a certain price range. The results will be sorted based on the total dishes in the price range that you entered.',
  summary: 'Restaurant by Dish Price',
  tags: ['restaurant'],
  query: {
    type: 'object',
    properties: {
      minPrice: {
        type: 'number',
        description: 'min price of the dish'
      },
      maxPrice: {
        type: 'number',
        description: 'max price of the dish'
      },
      limit: {
        type: 'number',
        description: 'limit data you want to display, default is 50'
      }
    },
    required: ['minPrice', 'maxPrice']
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
                example: 'name of restaurant'
              },
              totalDish: { type: 'number' },
              list: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'name of dish'
                    },
                    price: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    },
    ...notFound
  }
};

const getTransactions = {
  description:
    'This enpoint will return restaurant transactions list based restaurant name or slug you entered. You need to authorize with username and password. Use resto slug for username, and for password please using hungry12345678.',
  summary: 'Restaurant Transaction List',
  tags: ['transaction'],
  query: {
    type: 'object',
    properties: {
      slug: {
        type: 'string',
        description: 'resto slug, e.g orange-house'
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
              date: { type: 'string' },
              dish: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  name: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    ...unauthorized
  }
};

const getRestoByOpeningHours = {
  description:
    'You can find restaurants that have either the average opening hours per day or the total opening hours of the week.',
  summary: 'Restaurant Open X-Z hours per day or week',
  tags: ['restaurant'],
  query: {
    type: 'object',
    properties: {
      minHours: {
        type: 'number',
        description: 'min value for opening hours'
      },
      maxHours: {
        type: 'number',
        description: 'max value for opening hours'
      },
      type: {
        type: 'string',
        description: 'per day or per week (default per day)'
      },
      limit: {
        type: 'number',
        description: 'limit data you want to display, default is 50'
      }
    },
    required: ['minHours', 'maxHours']
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
              name: { type: 'string' },
              opening_hours: { type: 'string' }
            }
          }
        }
      }
    },
    ...notFound
  }
};

const restaurantList = {
  description: 'You can use this endpoint to show restaurant list.',
  summary: 'Restaurant List',
  tags: ['restaurant'],
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

const openRestoSchema = {
  description:
    'You can find all restaurants that are open at a certain datetime',
  summary: 'Get Open Restaurant base on certain datetime',
  tags: ['restaurant'],
  query: {
    type: 'object',
    properties: {
      datetime: {
        type: 'string',
        description: 'datetime, e.g 2021-03-11'
      }
    },
    required: ['datetime']
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
              name: { type: 'string' },
              thisDay: { type: 'string' }
            }
          }
        }
      }
    },
    ...notFound
  }
};

module.exports = {
  popularRestoSchema,
  nearbyRestoSchema,
  restoByDishPrice,
  getTransactions,
  getRestoByOpeningHours,
  restaurantList,
  openRestoSchema
};
