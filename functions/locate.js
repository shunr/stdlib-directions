const maps = require('../util/maps');

/**
* Function to get name and address of a place based on search query
* @param {string} query     Search query
* @param {string} location  Where to locate around, specified as latitude,longitude
* @param {number} radius    Radius to search, in meters
* @returns {object}
*/

module.exports = async (query, location='44.23,-76.495', radius=20000, context) => {
  let closest = await maps.locate(query, location, radius);
  return closest;
};