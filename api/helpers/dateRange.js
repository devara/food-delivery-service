const { utc } = require('moment');
const formatDateRange = (req) => {
  const date = {
    min:
      req.fromDate !== undefined && req.fromDate !== ''
        ? utc(`${req.fromDate} 00:00:00`).toDate()
        : utc().toDate(),
    max:
      req.toDate !== undefined && req.toDate !== ''
        ? utc(`${req.toDate} 23:59:59`).toDate()
        : utc().toDate()
  };

  const label = {
    min: date.min.toUTCString(),
    max: date.max.toUTCString()
  };

  return {
    date: date,
    label: label
  };
};

module.exports = { formatDateRange };
