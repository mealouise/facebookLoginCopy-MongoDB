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

//anoymous function - need to use function key word so can use methods like findOne - arrow function wouldnt work

//statics is add extra methods to this schema so they become properties of the schema and used through rest of code
user.statics.validateUser = async function(body) {
    
    //get user from database
    let user = await this.findOne({userName:body.userName});
    
    //if not user returned, return false
    if (!user) {
        return false; // the false stops if statement from passing
    }

    //next if user check passwords and if they dont match return false
    if (user.password != body.password) {
        return false; // this check failed
    }
    //otherwise if have user and the passwords match
    return user; // otherwise they match so will return all information about the relevant user

    // console.log(this); // Model { users }, will return null if user doesnt exist
}
module.exports = model('users', user);// 'users' is name of table in database