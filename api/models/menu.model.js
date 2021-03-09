const { Schema, model } = require('mongoose');

const MenuSchema = new Schema({
  name: {
    type: String
  },
  slug: {
    type: String
  },
  price: {
    type: Number
  },
  restaurant: {
    type: Object
  }
});

module.exports = MenuModel = model('Menu', MenuSchema);
