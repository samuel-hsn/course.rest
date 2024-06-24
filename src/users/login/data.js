const _ = require("lodash");
const jsonData = require('./data.json');
const cloneJsonData = _.cloneDeep(jsonData);

const waitAsync = (value) =>
    new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 1, value));

function _loadAsync(_data) {
    return waitAsync(_.cloneDeep(_data));
}

class User_data {
    constructor() {
        this._data = cloneJsonData;
    }

    async getUsersAsync() {
        const data = await _loadAsync(this._data);
        return _.cloneDeep(data.users);
    }
}

module.exports = User_data;