const transactionModel = require('../models/transaction.model');
const userModel = require('../models/users.model');
const restoModel = require('../models/restaurants.model');
const menuModel = require('../models/menu.model');
const { formatDateRange } = require('../helpers/dateRange');
const { errorResult } = require('../helpers/responses');
const { utc } = require('moment');

const restoTransactions = async (req) => {
  try {
    const relatedResto = req.slug;
    const data = await transactionModel
      .find({
        'restaurant.slug': relatedResto
      })
      .select({
        dish: 1,
        amount: 1,
        'user.name': 1,
        date: 1
      });

    return {
      status: 200,
      payload: {
        count: data.length,
        data: data
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const userTransactions = async (req) => {
  try {
    const relatedUser = req.slug;

    const data = await transactionModel
      .find({
        'user.slug': relatedUser
      })
      .select('-_id dish amount restaurant.name date');

    return {
      status: 200,
      payload: {
        count: data.length,
        data: data
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const popularRestoByTransactions = async (req) => {
  try {
    const limit =
      req.limit !== undefined && req.limit != '' ? parseInt(req.limit) : 50;
    const getData = await transactionModel.aggregate([
      {
        $group: {
          _id: '$restaurant.name',
          transactionCount: {
            $sum: 1
          },
          totalAmount: {
            $sum: '$amount'
          }
        }
      },
      {
        $sort: {
          transactionCount: -1,
          totalAmount: -1
        }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          transactionCount: 1,
          totalAmount: 1
        }
      }
    ]);

    return {
      status: 200,
      payload: {
        count: getData.length,
        data: getData
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const topPurchaseUser = async (req) => {
  try {
    const limit =
      req.limit !== undefined && req.limit !== '' ? parseInt(req.limit) : 10;

    const dateRangeParam = matchDateRange(req);

    const data = await transactionModel.aggregate([
      dateRangeParam.query,
      groupTransactionsQuery(),
      {
        $sort: {
          total: -1
        }
      },
      {
        $limit: limit
      },
      projectionResult()
    ]);
    return {
      status: 200,
      payload: {
        range: `${dateRangeParam.range.label.min} - ${dateRangeParam.range.label.max}`,
        count: data.length,
        data: data
      }
    };
  } catch (error) {
    errorResult(error);
  }
};

const userByTransactionAmount = async (req) => {
  try {
    const operator =
      req.operator !== undefined && req.operator != '' ? req.operator : 'above';
    const operatorQuery = operator == 'above' ? '$gte' : '$lte';
    const amount = parseFloat(req.amount);

    const dateRangeParam = matchDateRange(req);

    const data = await transactionModel.aggregate([
      dateRangeParam.query,
      groupTransactionsQuery(),
      {
        $match: {
          total: {
            [operatorQuery]: amount
          }
        }
      },
      {
        $sort: { total: -1 }
      },
      projectionResult()
    ]);

    return {
      status: 200,
      payload: {
        range: `${dateRangeParam.range.label.min} - ${dateRangeParam.range.label.max}`,
        count: data.length,
        data: data
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const matchDateRange = (req) => {
  const range = formatDateRange(req);
  const query = {
    $match: {
      $and: [
        {
          date: {
            $gte: range.date.min
          }
        },
        {
          date: {
            $lte: range.date.max
          }
        }
      ]
    }
  };
  return {
    range: range,
    query: query
  };
};

const groupTransactionsQuery = () => {
  const grouping = {
    $group: {
      _id: '$user.slug',
      name: {
        $first: '$user.name'
      },
      list: {
        $push: {
          dish: '$dish',
          amount: '$amount',
          restaurant: '$restaurant.name',
          date: {
            $dateToString: { date: '$date', format: '%Y-%m-%d' }
          }
        }
      },
      total: {
        $sum: '$amount'
      }
    }
  };
  return grouping;
};

const projectionResult = () => {
  return {
    $project: {
      _id: 0,
      name: 1,
      list: 1,
      total_transactions: {
        $round: ['$total', 2]
      }
    }
  };
};

const createUserTransaction = async (req) => {
  try {
    const menuPromise = menuModel
      .findOne({
        $and: [
          {
            slug: req.body.dish
          },
          {
            'restaurant.slug': req.body.restaurant
          }
        ]
      })
      .select('name price')
      .lean();

    const userPromise = userModel
      .findOne({
        slug: req.body.user
      })
      .select('name slug balance')
      .lean();

    const restoPromise = restoModel
      .findOne({
        slug: req.body.restaurant
      })
      .select('name slug balance')
      .lean();

    const [menuData, userData, restoData] = await Promise.all([
      menuPromise,
      userPromise,
      restoPromise
    ]);

    if (menuData == null || userData == null || restoData == null)
      return {
        status: 500,
        payload: {
          msg: `Data is not valid!`
        }
      };

    if (menuData.price > userData.balance) {
      return {
        status: 417,
        payload: {
          msg: `Your balance isn't enough!`,
          detail: {
            currentBalance: userData.balance,
            dish_price: menuData.price
          }
        }
      };
    } else {
      const transData = {
        amount: menuData.price,
        dish: menuData.name,
        date: utc().toDate(),
        restaurant: {
          name: restoData.name,
          slug: restoData.slug
        },
        user: {
          name: userData.name,
          slug: userData.slug
        }
      };
      await transactionModel.create(transData);

      const newRestoBalance = restoData.balance + menuData.price;

      await restoModel.findOneAndUpdate(
        {
          slug: restoData.slug
        },
        {
          balance: newRestoBalance
        },
        {
          upsert: true
        }
      );

      const newUserBalance = userData.balance - menuData.price;

      await userModel.findOneAndUpdate(
        {
          slug: userData.slug
        },
        {
          balance: newUserBalance
        },
        {
          upsert: true
        }
      );

      return {
        status: 200,
        payload: {
          msg: 'Transaction succesfully.',
          data: {
            previousBalance: userData.balance,
            currentBalance: newUserBalance
          }
        }
      };
    }
  } catch (error) {
    return errorResult(error);
  }
};

module.exports = {
  restoTransactions,
  userTransactions,
  popularRestoByTransactions,
  topPurchaseUser,
  userByTransactionAmount,
  createUserTransaction
};
