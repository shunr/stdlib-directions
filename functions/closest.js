const maps = require('../util/maps');

/**
* Function to get n closest destinations from origin
* @param {string} from    Starting point
* @param {array} toArray  Destinations
* @param {number} n       Number of destinations to return
* @returns {array}
*/

module.exports = async (from, toArray, n=5, context) => {
  let closest = await maps.nClosest(from, toArray, n);
  return closest;
};