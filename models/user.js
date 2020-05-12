var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new mongoose.Schema({
        username:  String,
        Password:  String,
        avatar:    {type: String, default: 'https://i.imgur.com/O2vFdrv.jpg'},
        firstName: String,
        lastName:  String,
        email:     String,
        isAdmin:   {type: Boolean, default: false},
        created:   {type: Date, default: Date.now}
    })

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);