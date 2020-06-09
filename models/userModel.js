const {Schema, model} = require('mongoose');

//defined schema
let user = new Schema({
    userName: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true}
}, {// method that says use this to return our returned data into an object
    toObject: {
        virtuals: true //just saying use this
    }
});

//turn schema into a model

module.exports = model('users', user);// 'users' is name of table in database