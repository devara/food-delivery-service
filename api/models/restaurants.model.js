const { Schema, model } = require('mongoose');

const RestaurantSchema = new Schema(
  {
    name: {
      type: String
    },
    slug: {
      type: String
    },
    balance: {
      type: Number
    },
    business_hours: {
      type: Array
    },
    location: {
      type: {
        type: String
      },
      coordinates: [Number]
    }
  }
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true }
  // }
);

// RestaurantSchema.virtual('menus', {
//   ref: 'Menu',
//   localField: 'slug',
//   foreignField: 'resto'
// });

// RestaurantSchema.virtual('transactions', {
//   ref: 'Transaction',
//   localField: 'slug',
//   foreignField: 'restaurant.slug'
// });

module.exports = RestaurantsModel = model('Restaurant', RestaurantSchema);
