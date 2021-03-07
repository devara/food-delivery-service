const restoModel = require('../models/restaurants.model');
const menuModel = require('../models/menu.model');
const transactionModel = require('../models/transaction.model');
const restoranModel = require('../models/resto.model');
const { slugify } = require('../helpers/slugify');
const { locationTranslate } = require('../helpers/location');
const { errorResult } = require('../helpers/responses');

const getResto = async (req) => {
  try {
    const fields =
      req.fields !== undefined && req.fields !== ''
        ? req.fields.split(',')
        : [];

    // const data = await restoranModel.aggregate([
    //   {
    //     $match: {
    //       // name: { $not: { $size: 0 } }
    //       name: 'Hungry Cafe'
    //     }
    //   },
    //   { $unwind: '$name' },
    //   {
    //     $group: {
    //       _id: { $toLower: '$name' },
    //       count: { $sum: 1 },
    //       menu: { $push: '$menu' }
    //     }
    //   },
    //   {
    //     $project: {
    //       name: 1,
    //       items: { $concatArrays: ['$menu'] }
    //     }
    //   }
    // ]);

    const selects = {
      name: 1,
      business_hours: 1
    };

    const data = await restoModel.find().select(selects);

    return {
      status: 200,
      payload: {
        count: data.length,
        datas: data
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const addResto = async (req) => {
  try {
    if (Array.isArray(req.body)) {
      return await bulkRecord(req.body);
    } else {
      return await singleRecord(req.body);
    }
  } catch (error) {
    return errorResult(error);
  }
};

const bulkRecord = async (body) => {
  try {
    const formatedData = mapData(body);

    let insertResto = null;
    if (formatedData.payload.restaurants.length)
      insertResto = await bulkRestaurant(formatedData.payload.restaurants);

    let insertMenu = null;
    if (formatedData.payload.menus.length)
      insertMenu = await bulkMenu(formatedData.payload.menus);

    await restoModel.collection.createIndex({ location: '2dsphere' });

    await restoModel.collection.createIndex({ name: 'text' });

    await menuModel.collection.createIndex({ name: 'text' });

    await menuModel.collection.createIndex({ price: 1 });

    return {
      status: 200,
      payload: {
        restoData: insertResto,
        menuData: insertMenu
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const singleRecord = async (body) => {
  try {
    // console.log(body);
    const finalData = mapRestaurant(body);
    const exec = await restoModel.findOneAndUpdate(
      {
        slug: finalData.slug
      },
      {
        $set: finalData
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    let importMenu = null;
    if (
      body.menu !== undefined &&
      Array.isArray(body.menu) &&
      body.menu.length
    ) {
      const relatedResto = {
        name: finalData.name,
        slug: finalData.slug
      };
      const menuData = mapMenu(relatedResto, body.menu);
      importMenu = await bulkMenu(menuData);
    }
    return {
      status: 200,
      payload: {
        data: exec,
        writeMenu: importMenu
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const mapData = (body) => {
  try {
    let restoData = [];
    let menuData = [];
    body.forEach((item) => {
      const resto = mapRestaurant(item);
      restoData.push(resto);
      if (Array.isArray(item.menu) && item.menu.length) {
        const relatedResto = {
          name: resto.name,
          slug: resto.slug
        };
        const menus = mapMenu(relatedResto, item.menu);
        menuData = [...menuData, ...menus];
      }
    });

    return {
      payload: {
        restaurants: restoData,
        menus: menuData
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const mapRestaurant = (item) => {
  const data = {
    name: item.name,
    slug: slugify(item.name),
    balance: parseFloat(item.balance),
    business_hours: item.business_hours,
    location: {
      type: 'Point',
      coordinates: locationTranslate(item)
    }
  };

  return data;
};

const mapMenu = (relatedResto, data) => {
  const menus = data.map((item) => {
    const menu = {
      name: item.name,
      price: item.price,
      restaurant: relatedResto
    };
    return menu;
  });

  return menus;
};

const bulkRestaurant = async (data) => {
  try {
    const importData = await restoModel.bulkWrite(
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
            importData.nUpserted > 0
              ? importData.nUpserted + ' restaurants inserted'
              : 'no restaurants inserted',
          update_msg:
            importData.nModified > 0
              ? importData.nModified + ' restaurants updated'
              : 'no restaurants updated',
          match_msg:
            importData.nMatched > 0
              ? importData.nMatched + ' restaurants matches'
              : 'no restaurants matches'
        }
        // data: importData
      }
    };
  } catch (error) {
    errorResult(error);
  }
};

const bulkMenu = async (data) => {
  try {
    const writeMenu = await menuModel.bulkWrite(
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
            writeMenu.nUpserted > 0
              ? writeMenu.nUpserted + ' menus inserted'
              : 'no menu inserted',
          update_msg:
            writeMenu.nModified > 0
              ? writeMenu.nModified + ' menus updated'
              : 'no menu updated',
          match_msg:
            writeMenu.nMatched > 0
              ? writeMenu.nMatched + ' menus matches'
              : 'no menu matches'
        }
        // data: writeMenu
      }
    };
  } catch (error) {
    errorResult(error);
  }
};

const getRestoByLoc = async (req) => {
  try {
    const longitude =
      req.longitude !== undefined && req.longitude !== ''
        ? parseFloat(req.longitude)
        : 0;
    const latitude =
      req.longitude !== undefined && req.longitude !== ''
        ? parseFloat(req.latitude)
        : 0;

    const maxDistance =
      req.maxDistance !== undefined && req.maxDistance !== ''
        ? parseFloat(req.maxDistance)
        : 1000;

    const getData = await restoModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          distanceField: 'distanceCalculation',
          maxDistance: maxDistance,
          spherical: true
        }
      },
      {
        $sort: {
          distanceCalculation: 1
        }
      },
      {
        $project: {
          name: 1,
          distance: {
            meters: {
              value: { $round: ['$distanceCalculation', 2] },
              label: { $toString: { $round: ['$distanceCalculation', 2] } }
            },
            kilometers: {
              value: {
                $round: [{ $divide: ['$distanceCalculation', 1000] }, 2]
              },
              label: {
                $toString: {
                  $round: [{ $divide: ['$distanceCalculation', 1000] }, 2]
                }
              }
            }
          }
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

const getTransactions = async (req) => {
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

const popularRestaurant = async (req) => {
  try {
    const limit =
      req.limit !== undefined && req.limit != '' ? parseInt(req.limit) : 50;
    const getData = await transactionModel.aggregate([
      {
        $group: {
          _id: '$restaurant.name',
          totalTransaction: {
            $sum: 1
          },
          totalAmount: {
            $sum: '$amount'
          }
        }
      },
      {
        $sort: {
          totalTransaction: -1,
          totalAmount: -1
        }
      },
      {
        $limit: limit
      }
    ]);

    return {
      status: 200,
      payload: {
        data: getData
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const restoHasDishwithPriceRange = async (req) => {
  try {
    const minPrice =
      req.minPrice !== undefined && parseFloat(req.minPrice) !== NaN
        ? parseFloat(req.minPrice)
        : 0;
    const maxPrice =
      req.maxPrice !== undefined && parseFloat(req.maxPrice) !== NaN
        ? parseFloat(req.maxPrice)
        : 10;

    const getData = await menuModel.aggregate([
      {
        $match: {
          $and: [
            {
              price: {
                $gte: minPrice
              }
            },
            {
              price: {
                $lte: maxPrice
              }
            }
          ]
        }
      },
      {
        $group: {
          _id: '$restaurant.name',
          totalDish: {
            $sum: 1
          },
          list: {
            $push: {
              name: '$name',
              price: '$price'
            }
          }
        }
      },
      {
        $sort: {
          totalDish: -1
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
    return;
  }
};

module.exports = {
  addResto,
  getResto,
  getRestoByLoc,
  getTransactions,
  popularRestaurant,
  restoHasDishwithPriceRange
};
