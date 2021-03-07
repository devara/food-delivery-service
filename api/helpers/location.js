const locationTranslate = (item) => {
  const longlat = item.location !== undefined ? item.location.split(',') : null;

  const coordinates =
    longlat !== null && longlat.length > 1
      ? [parseFloat(longlat[1]), parseFloat(longlat[0])]
      : [0, 0];

  return coordinates;
};

module.exports = { locationTranslate };
