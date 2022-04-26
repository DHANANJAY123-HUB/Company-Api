const mongoose = require('mongoose');


const dataSchema = new mongoose.Schema({
    first_name: {
        required: true,
        type: String
    },
    last_name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        lowercase: true,
        unique: true,
        normalizeEmail: true
    },
    user_name: {
        required: true,
        type: String,
        min: 3,
        max: 8,
        unique: true
    },
    password: {
        required: true,
        type: String,
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
    
    },
    profile_pic: {
        required: true,
        type: String,
        data: Buffer

    },
    date_of_birth: {
        required: true,
        type: String,
        format: 'mm-dd-yyyy',
        autoclose:true,
        endDate: 'today'
    },
    token: { 
    type: String 
    },
    
},
   { timestamps: true }
)

 module.exports = mongoose.model("data",  dataSchema)




