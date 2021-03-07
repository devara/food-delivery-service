const { ReasonPhrases, StatusCodes } = require('http-status-codes');
const errorResult = (err) => {
  return {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    payload: {
      msg: err.message
    }
  };
};

const notFound = () => {
  return {
    status: StatusCodes.NOT_FOUND,
    payload: {
      msg: ReasonPhrases.NOT_FOUND
    }
  };
};

const badRequest = () => {
  return {
    status: StatusCodes.BAD_REQUEST,
    payload: {
      msg: ReasonPhrases.BAD_REQUEST
    }
  };
};

module.exports = { errorResult, notFound, badRequest };
