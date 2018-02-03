const maps = require('../util/maps');

/**
* Function to get walking directions from two search queries
* @param {string} from  Starting point
* @param {string} to    Destination
* @param {string} mode  Transportation mode
* @returns {string}
*/

module.exports = async (from, to, mode='walking', context) => {
  const modes = ['walking', 'driving', 'bicycling', 'transit'];
  if (!modes.includes(mode)) {
    mode = 'walking';
  }
  let directions = await maps.getDirections(from, to, mode);
  return maps.toText(directions);
};
