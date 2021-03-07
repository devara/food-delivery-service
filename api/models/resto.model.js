const { Schema, model } = require('mongoose');

const Restos = new Schema({
  name: {
    type: String
  },
  balance: {
    type: String
  },
  business_hours: {
    type: String
  },
  // business_hours: {
  //   type: Object,
  //   default: {}
  // },
  location: {
    type: String
  },
  menu: {
    type: Array,
    default: []
  }
});

module.exports = RestoModel = model('Restos', Restos);
