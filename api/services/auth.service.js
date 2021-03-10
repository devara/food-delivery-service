const { errorResult } = require('../helpers/responses');
const userModel = require('../models/users.model');
const restoModel = require('../models/restaurants.model');
const validate = async (username, password, req, reply) => {
  try {
    if (/\/restaurant.*|\/v1$/.test(req.url)) {
      const checkResto = await restoModel.findOne({
        slug: username
      });
      if (checkResto === null)
        return new Error('Oops! You are not a hunger breaker!');
    } else if (
      /\/user.*|\/v1$/.test(req.url) ||
      /\/create.*|\/v1$/.test(req.url)
    ) {
      const checkUser = await userModel.findOne({
        slug: username
      });
      if (checkUser === null)
        return new Error('Oops! You are not a hungry member!');
    }
    if (password !== 'hungry12345678')
      return new Error('Ah! You must be hungry first!');
  } catch (error) {
    return errorResult(error);
  }
};

module.exports = {
  validate
};
