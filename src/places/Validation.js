const Validator = require('jsonschema').Validator;

class Validation {
    constructor() {
        this.Validator = new Validator();
    }

    validatePlace(place, options = null) {
        return this.Validator.validate(place, placeSchema, options);
    }
}

var placeSchema = {
    "id": "/Place",
    "type": "object",
    "properties": {
        "image": {
            "type": "object",
            "properties": {
                "url": { "type": "string", "pattern": "(https|http):?:\/\/.*" },
                "title": { "type": "string", "minLength": 3, "maxLength": 100 }
            },
            "required": ["url", "title"]
        },
        "author": { "type": "string", "minLength": 3, "maxLength": 100, pattern: '^[a-zA-Z -]*$' },
        "review": { "type": "integer", "minimum": 1, "maximum": 9 },
        "name": { "type": "string", "minLength": 3, "maxLength": 100, pattern: '^[a-zA-Z -]*$' }
    },
    "required": ["author", "review", "name"]
};
                            
module.exports = Validation;
