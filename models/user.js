const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportlocalmongoose =  require('passport-local-mongoose')

const userSchema = new Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        required:true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active:Boolean,
    Token: String

})


userSchema.plugin(passportlocalmongoose)
const user = mongoose.model('user', userSchema)

module.exports = user