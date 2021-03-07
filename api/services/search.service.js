const restoModel = require('../models/restaurants.model');
const menuModel = require('../models/menu.model');
const { errorResult } = require('../helpers/responses');

const restoAndMenuSearch = async (req) => {
  try {
    const keywords = req.words
      .split(/\s+/)
      .map((word) => `\"${word}\"`)
      .join(' ');
    console.log(keywords);
    let restoData = await restoModel
      .find(
        {
          $text: {
            $search: keywords
          }
        },
        { searchScore: { $meta: 'textScore' } }
      )
      .select({
        _id: 0,
        name: 1
      })
      .lean();
    restoData = restoData.map((item) => {
      item.type = 'restaurant';
      return item;
    });

    let menuData = await menuModel
      .find(
        {
          $text: {
            $search: keywords
          }
        },
        { searchScore: { $meta: 'textScore' } }
      )
      .select({
        _id: 0,
        name: 1,
        price: 1,
        'restaurant.name': 1
      })
      .lean();
    menuData = menuData.map((item) => {
      item.type = 'dish';
      item.restaurant = item.restaurant.name;
      return item;
    });

    let result = [...restoData, ...menuData];
    result.sort((a, b) => (a.searchScore > b.searchScore ? -1 : 0));

    return {
      status: 200,
      payload: {
        count: result.length,
        data: result
      }
    };
  } catch (error) {
    return errorResult(error);
  }
};

const restoHasDish = async (req) => {
  try {
    const keywords = req.words
      .split(/\s+/)
      .map((word) => `\"${word}\"`)
      .join(' ');

    const limit =
      req.limit !== undefined && req.limit != '' ? parseInt(req.limit) : 500;
    const getData = await menuModel.aggregate([
      {
        $match: {
          $text: {
            $search: keywords
          }
        }
      },
      {
        $group: {
          _id: '$restaurant.name',
          list: {
            $push: {
              name: '$name'
            }
          },
          totalDish: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          score: { $meta: 'textScore' },
          totalDish: -1
        }
      },
      {
        $limit: limit
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

module.exports = { restoAndMenuSearch, restoHasDish };
