const maps = require('../util/maps');

/**
* Function to get n closest destinations from origin
* @param {number} n       Number of destinations to return
* @param {object} from    Starting point
* @param {array} toArray  Destinations
* @returns {array}
*/

module.exports = async (n=5, from, toArray, context) => {
  if (toArray.length == 0) return [];
  let closest = await maps.nClosest(from, toArray, n);
  return closest;
};