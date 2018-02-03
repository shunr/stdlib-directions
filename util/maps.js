const maps = require('@google/maps');
const striptags = require('striptags');

const mapsClient = maps.createClient({
  key: process.env.MAPS_API_KEY,
  Promise: Promise
});

let mod = module.exports = {};

mod.getDirections = (from, to, mode) => {
  return mapsClient.directions({
    origin: from,
    destination: to,
    mode: mode
  }).asPromise();
}

mod.nClosest = (from, toArray, n) => {
  let p = new Promise((resolve) => {
    mapsClient.distanceMatrix({
      origins: [from],
      destinations: toArray,
    }).asPromise().then((data) => {
      resolve(parseDistanceMatrix(data.json, toArray, n));
    });
  });
  return p;
}

mod.toText = (obj) => {
  if (obj.status != 200) return 'Not valid';
  let route = obj.json.routes[0].legs[0];
  let text = '';
  for (step of route.steps) {
    text += striptags(step.html_instructions) + ' | ' + step.distance.text + '\n';
  }
  text += 'Arrive at ' + route.end_address;
  return text;
}

function parseDistanceMatrix(matrix, names, n) {
  let sorted = [];
  let elements = matrix.rows[0].elements;
  let addresses = matrix.destination_addresses;
  for (let i = 0; i < elements.length; i++) {
    elements[i].index = i;
  }
  elements.sort(sortHelper);
  for (let i = 0; i < Math.min(elements.length, n); i++) {
    let index = elements[i].index;
    sorted.push({
      name: names[index],
      address: addresses[index],
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