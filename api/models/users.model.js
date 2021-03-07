const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  name: {
    type: String
  },
  slug: {
    type: String
  },
  balance: {
    type: Number
  },
  location: {
    type: {
      type: String
    },
    coordinates: [Number]
  }
});

module.exports = UserModel = model('User', UserSchema);
