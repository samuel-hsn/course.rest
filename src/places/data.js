const _ = require("lodash");
const { v1: uuidv1 } = require("uuid");
const jsonData = require("./data.json");
const { Validator } = require('jsonschema');

const validator = new Validator();

// Schéma de validation des données
const placeSchema = {
  "id": "/Place",
  "type": "object",
  "properties": {
    "image": {
      "type": "object",
      "properties": {
        "url": { "type": "string", "pattern": "(https|http):?:\\/\\/.*" },
        "title": { "type": "string", "minLength": 3, "maxLength": 100 }
      },
      "required": ["url", "title"]
    },
    "author": { "type": "string", "minLength": 3, "maxLength": 100, "pattern": "^[a-zA-Z -]*$" },
    "review": { "type": "integer", "minimum": 0, "maximum": 9 },
    "name": { "type": "string", "minLength": 3, "maxLength": 100, "pattern": "^[a-zA-Z -]*$" }
  },
  "required": ["author", "review", "name"]
};

// Fonction pour valider les données
function validatePlace(place) {
  const errors = [];

  if (!place.name || typeof place.name !== 'string') {
    errors.push(new Error('Name must be a non-empty string'));
  }

  if (!place.author || typeof place.author !== 'string') {
    errors.push(new Error('Author must be a non-empty string'));
  }

  if (place.review === undefined || typeof place.review !== 'number') {
    errors.push(new Error('Review must be a number'));
  }

  // Vérifie si le champ image existe et s'il est de type objet
  if (place.image && typeof place.image !== 'object') {
    errors.push(new Error('Image must be an object'));
  }

  return errors;
}

const cloneJsonData = _.cloneDeep(jsonData);

const waitAsync = (value) =>
    new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 1, value));

function _loadAsync(_data) {
  return waitAsync(_.cloneDeep(_data));
}

function _saveAsync(data, _data) {
  Object.assign(_data, data);
  return waitAsync();
}

class Data {
  constructor() {
    this._data = cloneJsonData;
  }

  async getPlacesAsync() {
    const data = await _loadAsync(this._data);
    return _.cloneDeep(data);
  }

  async getPlaceAsync(id) {
    const data =  await _loadAsync(this._data);
    const places = data.places;
    let place = _.find(places, {
      id: id
    });
    return _.cloneDeep(place);
  }

  async savePlaceAsync(place) {
    // Valider les données de la place
    const errors = validatePlace(place);
    if (errors.length > 0) {
      throw new Error(`Invalid place data: ${errors.map(e => e.stack).join(', ')}`);
    }
    
    const data = await _loadAsync(this._data);
    const places = data.places;
    let id;

    if (!place.id) {
      // insert
      id = uuidv1();
      let newPlace = _.cloneDeep(place);
      newPlace.id = id;
      places.push(newPlace);
    } else {
      // replace
      id = place.id;
      _.remove(places, { id });
      places.push(_.cloneDeep(place));
    }

    await _saveAsync(data, this._data);
    return id;
  }  

  async deletePlaceAsync(id) {
    const data = await _loadAsync(this._data);
    let places = data.places;
    let place = _.find(places, { id });
    if (place !== undefined) {
      var index = places.indexOf(place);
      places.splice(index, 1);
    } else {
      return false;
    }
    await _saveAsync({ places }, this._data);
    return true;
  }
}

module.exports = Data;
