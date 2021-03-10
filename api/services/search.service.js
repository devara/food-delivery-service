const restoModel = require('../models/restaurants.model');
const menuModel = require('../models/menu.model');
const { errorResult, notFound } = require('../helpers/responses');

const restoAndMenuSearch = async (req) => {
  try {
    const keywords = req.words
      .split(/\s+/)
      .map((word) => `\"${word}\"`)
      .join(' ');
    const restoPromise = restoModel
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

    const menuPromise = menuModel
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

    const [restoData, menuData] = await Promise.all([
      restoPromise,
      menuPromise
    ]);

    if (restoData.length === 0 && menuData.length === 0) return notFound();

    const restoResult = restoData.map((item) => {
      item.type = 'restaurant';
      return item;
    });
    const menuResult = menuData.map((item) => {
      item.type = 'dish';
      item.restaurant = item.restaurant.name;
      return item;
    });

    let result = [...restoResult, ...menuResult];
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
      req.limit !== undefined && req.limit != '' ? parseInt(req.limit) : 50;
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
          dish_lists: {
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
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          totalDish: 1,
          dish_lists: 1
        }
      }
    ]);

    if (getData.length === 0) return notFound();

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
