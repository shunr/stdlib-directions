const maps = require('@google/maps');
const lib = require('lib');
const striptags = require('striptags');

const mapsClient = maps.createClient({
  key: process.env.MAPS_API_KEY,
  Promise: Promise
});

let mod = module.exports = {};

mod.getDirections = (from, to, mode) => {
  return mapsClient.directions({
    origin: from.address,
    destination: to.address,
    mode: mode
  }).asPromise();
}

mod.nClosest = (from, toArray, n) => {
  let p = new Promise((resolve) => {
    let addresses = [];
    for (dest of toArray) {
      addresses.push(dest.address);
    }
    mapsClient.distanceMatrix({
      origins: [from.address],
      destinations: addresses,
    }).asPromise().then((data) => {
      resolve(parseDistanceMatrix(data.json, toArray, n));
    }).catch((err) => resolve([]));
  });
  return p;
}

mod.locate = (query, location, radius) => {
  let p = new Promise((resolve) => {
    mapsClient.places({
      query: query,
      location: location,
      radius: radius
    }).asPromise().then((data) => {
      let out = {};
      if (data.json.results.length > 0) {
        let result = data.json.results[0];
        out = {
          name: result.name,
          address: result.formatted_address
        };
      }
      resolve(out);
    });
  });
  return p;
}

mod.toText = (obj, to) => {
  if (obj.status != 200) return 'Error finding directions';
  let route = obj.json.routes[0].legs[0];
  let text = '';
  for (let i = 0; i < route.steps.length; i++) {
    let step = route.steps[i];
    if (i < route.steps.length - 1) {
      text += striptags(step.html_instructions);
      text += '\n-- ' + step.distance.text +' --\n\n';
    } else {
      let last = '\n-- ' + step.distance.text + ' --\n\nArrive at ' + to.name;
      text += striptags(step.html_instructions).replace('Destination will be', last);
    }
  }
  return text;
}

async function parseDistanceMatrix(matrix, locations, n) {
  let sorted = [];
  let elements = matrix.rows[0].elements;
  for (let i = 0; i < elements.length; i++) {
    elements[i].index = i;
  }
  elements.sort(sortHelper);
  for (let i = 0; i < Math.min(elements.length, n); i++) {
    let index = elements[i].index;
    sorted.push({
      name: locations[index].name,
      address: locations[index].address,
      distance: elements[i].distance.text,
      duration: elements[i].duration.text
    });
  }
  return sorted;
}

function sortHelper(a, b) {
  let dA = a.distance.value;
  let dB = b.distance.value;
  if (dA < dB) return -1;
  if (dA > dB) return 1;
  return 0;
}