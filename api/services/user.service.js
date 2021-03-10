const userModel = require('../models/users.model');
const transactionModel = require('../models/transaction.model');
const { slugify } = require('../helpers/slugify');
const { locationTranslate } = require('../helpers/location');
const { errorResult } = require('../helpers/responses');

const getUsers = async (req) => {
  try {
    let offset = 0;
    let limit = 10;
    let page = 1;

    if (req.limit !== undefined && req.limit != '') {
      limit = parseInt(req.limit);
    }
    if (req.page !== undefined && req.page != '') {
      offset = limit * (parseInt(req.page) - 1);
      page = parseInt(req.page);
    }
    const selects = {
      _id: 0
    };

    const data = await userModel
      .find()
      .select(selects)
      .skip(offset)
      .limit(limit);

    return {
      status: 200,
      payload: {
        page: page,
        show: data.length,
        data: data
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const addUser = async (req) => {
  try {
    if (Array.isArray(req.body)) {
      return await bulkAdd(req.body);
    } else {
      return await singleAdd(req.body);
    }
  } catch (error) {
    return errorResult(error);
  }
};

const bulkAdd = async (body) => {
  try {
    const formatedData = mappingData(body);

    let insertUsers = null;
    if (formatedData.payload.users.length)
      insertUsers = await bulkUser(formatedData.payload.users);

    let insertTransaction = null;
    if (formatedData.payload.transactions.length)
      insertTransaction = await bulkTransaction(
        formatedData.payload.transactions
      );

    await transactionModel.collection.createIndex({
      'restaurant.slug': 1
    });

    await transactionModel.collection.createIndex({
      'user.slug': 1
    });

    await transactionModel.collection.createIndex({
      amount: 1
    });

    return {
      status: 200,
      payload: {
        userData: insertUsers,
        transactionData: insertTransaction
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const singleAdd = async (body) => {
  try {
    if (body === null) throw new Error('JSON data is empty!');
    const userData = mapUser(body);
    const insertUser = await userModel.findOneAndUpdate(
      {
        slug: userData.slug
      },
      {
        $set: userData
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    let insertTransaction = null;
    if (
      body.purchases !== undefined &&
      Array.isArray(body.purchases) &&
      body.purchases.length
    ) {
      const userRelated = {
        name: userData.name,
        slug: userData.slug
      };
      const transactionData = mapTransaction(userRelated, body.purchases);
      insertTransaction = await bulkTransaction(transactionData);
    }

    return {
      status: 200,
      payload: {
        user: insertUser,
        transactions: insertTransaction
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const mappingData = (body) => {
  try {
    let userData = [];
    let transactionData = [];
    body.forEach((item) => {
      const user = mapUser(item);
      userData.push(user);
      if (Array.isArray(item.purchases) && item.purchases.length) {
        const userRelated = {
          name: user.name,
          slug: user.slug
        };
        const transaction = mapTransaction(userRelated, item.purchases);
        transactionData = [...transactionData, ...transaction];
      }
    });
    return {
      payload: {
        users: userData,
        transactions: transactionData
      }
    };
  } catch (error) {
    errorResult(error);
  }
};

const mapUser = (item) => {
  const data = {
    name: item.name,
    slug: slugify(item.name),
    balance: parseFloat(item.balance),
    location: {
      type: 'Point',
      coordinates: locationTranslate(item)
    }
  };

  return data;
};

const mapTransaction = (user, data) => {
  const transaction = data.map((val) => {
    return {
      user: user,
      restaurant: {
        name: val.restaurant_name,
        slug: slugify(val.restaurant_name)
      },
      dish: val.dish,
      amount: parseFloat(val.amount),
      date: new Date(val.date)
    };
  });

  return transaction;
};

const bulkUser = async (data) => {
  try {
    const writeUsers = await userModel.bulkWrite(
      data.map((item) => ({
        updateOne: {
          filter: { slug: item.slug },
          update: { $set: item },
          upsert: true
        }
      }))
    );

    return {
      payload: {
        msg: 'store data successfully.',
        detail: {
          insert_msg:
            writeUsers.nUpserted > 0
              ? writeUsers.nUpserted + ' users inserted'
              : 'no users inserted'
        }
        // data: writeUsers
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const bulkTransaction = async (data) => {
  try {
    const writeTransactions = await transactionModel.bulkWrite(
      data.map((item) => ({
        updateOne: {
          filter: item,
          update: { $set: item },
          upsert: true
        }
      }))
    );

    return {
      payload: {
        msg: 'store data successfully.',
        detail: {
          insert_msg:
            writeTransactions.nUpserted > 0
              ? writeTransactions.nUpserted + ' transactions inserted'
              : 'no transactions inserted'
        }
        // data: writeTransactions
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

module.exports = {
  addUser,
  getUsers
};
