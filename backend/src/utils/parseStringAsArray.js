module.exports = function parseStringAsArray(arrayAsString) {
  if (arrayAsString) {
    return arrayAsString.split(",").map(item => item.trim());
  }
  return [];
};
