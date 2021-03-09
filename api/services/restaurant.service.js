const restoModel = require('../models/restaurants.model');
const menuModel = require('../models/menu.model');
const { slugify } = require('../helpers/slugify');
const { locationTranslate } = require('../helpers/location');
const { errorResult } = require('../helpers/responses');
const moment = require('moment');
const momentDuration = require('moment-duration-format');
momentDuration(moment);

const getResto = async (req) => {
  try {
    const selects = {
      _id: 0
    };

    const data = await restoModel.find().select(selects);

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
    business_hours: mapHours(item.business_hours),
    location: {
      type: 'Point',
      coordinates: locationTranslate(item)
    }
  };

  return data;
};

const mapHours = (data) => {
  let business_hours = [];
  let openHours = data !== null ? data.split(' | ') : [];
  if (openHours.length) {
    openHours.forEach((days) => {
      const dayWithHours = days.split(': ');
      const multiDay = /-/.test(dayWithHours[0])
        ? dayWithHours[0].split('-')
        : dayWithHours[0].split(', ');
      multiDay.forEach((day) => {
        let dayName = 'sunday';
        switch (day.toLowerCase()) {
          case 'sunday':
          case 'sun':
            dayName = 'Sunday';
            break;
          case 'monday':
          case 'mon':
            dayName = 'Monday';
            break;
          case 'tuesday':
          case 'tues':
            dayName = 'Tuesday';
            break;
          case 'wednesday':
          case 'weds':
            dayName = 'Wednesday';
            break;
          case 'thursday':
          case 'thurs':
            dayName = 'Thursday';
            break;
          case 'friday':
          case 'fri':
            dayName = 'Friday';
            break;
          case 'saturday':
          case 'sat':
            dayName = 'Saturday';
            break;
        }
        const hoursSplit = dayWithHours[1].split(' - ');
        /**
         * Add the custom date to get different close and open hour
         * If close hour and open hour is same type (example: both using AM)
         */
        let closeHour = `2020-01-01 ${hoursSplit[1]}`;
        const openHour = `2020-01-01 ${hoursSplit[0]}`;

        let close = moment.utc(closeHour, ['YYYY-MM-DD h:mm A']);
        const open = moment.utc(openHour, ['YYYY-MM-DD h:mm A']);

        if (close.isBefore(open)) {
          closeHour = `2020-01-02 ${hoursSplit[1]}`;
          close = moment.utc(closeHour, ['YYYY-MM-DD h:mm A']);
        }
        const total = moment.duration(close.diff(open)).asHours();

        const dayData = {
          day: dayName,
          open: hoursSplit[0],
          // open: moment.utc(hoursSplit[0], ['h:mm A']).format('HH:mm'),
          open_hour_in_seconds: moment(hoursSplit[0], 'h:mm A').diff(
            moment().startOf('day'),
            'seconds'
          ),
          close: hoursSplit[1],
          // close: moment.utc(hoursSplit[1], ['h:mm A']).format('HH:mm'),
          close_hour_in_seconds: moment(hoursSplit[1], 'h:mm A').diff(
            moment().startOf('day'),
            'seconds'
          ),
          totalHours: total
        };
        business_hours.push(dayData);
      });
    });
  }

  return business_hours;
};

const mapMenu = (relatedResto, data) => {
  const menus = data.map((item) => {
    const menu = {
      name: item.name,
      slug: slugify(item.name),
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
              : 'no restaurants inserted'
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
          filter: { slug: item.slug, restaurant: item.restaurant },
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
              : 'no menu inserted'
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

const restoOpenHours = async (req) => {
  try {
    if (req.minHours === undefined || req.maxHours === undefined)
      return {
        status: 500,
        payload: {
          msg: 'Parameter is not valid!'
        }
      };
    const minHours = parseFloat(req.minHours);
    const maxHours = parseFloat(req.maxHours);

    const projectionQuery = projectionHours(req);
    const getData = await restoModel.aggregate([
      projectionQuery,
      {
        $match: {
          $and: [
            {
              openHours: {
                $gte: minHours
              }
            },
            {
              openHours: {
                $lte: maxHours
              }
            }
          ]
        }
      },
      {
        $sort: {
          openHours: -1
        }
      }
    ]);

    const perType = req.type !== undefined && req.type != '' ? req.type : 'day';

    const resultData = getData.map((item) => {
      const totalHours = moment
        .duration(item.openHours, 'h')
        .format('HH:m')
        .split(':');
      const hours =
        parseFloat(totalHours[0]) > 1
          ? `${totalHours[0]} hours`
          : `${totalHours[0]} hour`;

      const minutes =
        parseFloat(totalHours[1]) > 1 ? ` ${totalHours[1]} minutes` : '';

      return {
        name: item.name,
        opening_hours: `${hours}${minutes} per ${perType}`
      };
    });

    return {
      status: 200,
      payload: {
        count: resultData.length,
        data: resultData
      }
    };
  } catch (error) {
    errorResult(error);
  }
};

const projectionHours = (req) => {
  let hourQuery = {
    $round: [
      {
        $avg: '$business_hours.totalHours'
      },
      2
    ]
  };

  if (req.type == 'week') {
    hourQuery = {
      $sum: '$business_hours.totalHours'
    };
  }

  const query = {
    $project: {
      name: 1,
      openHours: hourQuery
    }
  };

  return query;
};

const getOpenResto = async (req) => {
  try {
    const dateParam = req.datetime;
    const day = moment(dateParam, 'YYYY-MM-DD HH:mm A').format('dddd');

    const hourMinute = moment(dateParam, 'YYYY-MM-DD HH:mm A').format(
      'HH:mm A'
    );
    const seconds = moment(hourMinute, 'HH:mm A').diff(
      moment().startOf('day'),
      'seconds'
    );
    console.log(seconds);

    let getData = await restoModel.aggregate([
      {
        $project: {
          name: 1,
          currentDay: {
            $filter: {
              input: '$business_hours',
              as: 'item',
              cond: {
                $eq: ['$$item.day', day]
              }
            }
          }
        }
      },
      {
        $match: {
          $and: [
            {
              'currentDay.open_hour_in_seconds': {
                $lte: seconds
              }
            },
            {
              'currentDay.close_hour_in_seconds': {
                $gte: seconds
              }
            }
          ]
        }
      }
    ]);

    if (getData.length) {
      getData = getData.map((item) => {
        const currentDayOperational = item.currentDay[0];
        return {
          name: item.name,
          thisDay: `${currentDayOperational.day}, ${currentDayOperational.open} - ${currentDayOperational.close}`
        };
      });
    }

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

module.exports = {
  addResto,
  getResto,
  getRestoByLoc,
  restoHasDishwithPriceRange,
  restoOpenHours
};
