
const maps = require('@google/maps');
const mapsClient = maps.createClient({
  key: process.env.MAPS_API_KEY,
  Promise: Promise
});

let mod = module.exports = {};

mod.test = (address = '1600 Amphitheatre Parkway, Mountain View, CA') =>{
  return mapsClient.geocode({address: address}).asPromise();
}