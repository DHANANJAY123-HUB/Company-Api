const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    house_number: {
        required: true,
        type: String,
        min: 2,
        max: 4  
    },
    building_name: {
        required: true,
        type: String
    },
    address_line1: {
        required: true,
        type: String
    },
    address_line2: {
        required: true,
        type: String
    },
    city: {
        required: true,
        type: String
    },
    state: {
        required: true,
        type: String
    },
    zip_code: {
        required: true,
        type: Number,
        minLength: 3,
        maxLength: 6  
    },
    isDefault:{
        required:true,
        type:String
    }
})

module.exports = mongoose.model('Test', dataSchema)
