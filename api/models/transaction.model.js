const { Schema, model } = require('mongoose');

const TransactionSchema = new Schema({
  user: {
    type: Object
  },
  restaurant: {
    type: Object
  },
  dish: {
    type: String
  },
  amount: {
    type: Number
  },
  date: {
    type: Date
  }
});

module.exports = TransactionModel = model('Transaction', TransactionSchema);
