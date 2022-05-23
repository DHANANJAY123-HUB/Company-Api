const mongoose = require('mongoose');
//const config = require('../routes/index');


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
    /*profile_pic: {
        required: true,
        type: String,
        data: Buffer

    },*/
    date_of_birth: {
        required: true,
        type:  Date,
        format: 'yyyy-MM-dd',
        endDate: 'today',
        maxDate: 'today',
        autoclose:true
    },
    user_type:{
        required:true,
        type:String
    },
    loginAttempts:{
        type: Number, 
        required: true, 
        default: 0
    },
    
    passwordResetExpires: Date,
    lockUntil: Number,
    
    token: { 
    required:true,
    type: String
    }
},
   { timestamps: true }
)

dataSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

dataSchema.methods.incrementLoginAttempts = function(callback) {
    console.log("lock until",this.lockUntil)
    // if we have a previous lock that has expired, restart at 1
    var lockExpired = !!(this.lockUntil && this.lockUntil < Date.now());
console.log("lockExpired",lockExpired)
    if (lockExpired) {
        return this.update({
            $set: { loginAttempts: 3 },
            $unset: { lockUntil: 3 }
        }, callback);
    }
// otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 3 } };
         // lock the account if we've reached max attempts and it's not locked already
    var needToLock = !!(this.loginAttempts + 1 >= config.login.maxAttempts && !this.isLocked);
console.log("needToLock",needToLock)
console.log("loginAttempts",this.loginAttempts)
    if (needToLock) {
        updates.$set = { lockUntil: Date.now() + login.lockoutHours };
        console.log("config.login.lockoutHours",Date.now() + config.login.lockoutHours)
    }
//console.log("lockUntil",this.lockUntil)
    return this.update(updates, callback);
};

 module.exports = mongoose.model("data",  dataSchema)




