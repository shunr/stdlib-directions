const maps = require('../util/maps');

/**
* Function to get walking directions from two search queries
* @param {string} mode  Transportation mode
* @param {object} from  Starting point
* @param {object} to    Destination
* @returns {string}
*/

module.exports = async (mode='walking', from, to, context) => {
  const modes = ['walking', 'driving', 'bicycling', 'transit'];
  if (!modes.includes(mode) || mode == null) {
    mode = 'walking';
  }
  let directions = await maps.getDirections(from, to, mode);
  return maps.toText(directions, to);
};
