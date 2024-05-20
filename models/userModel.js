const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Name is require']
    },
    email : {
        type: String,
        // required: [true, 'Email is require']
    },
    phoneNumber : {
        type: Number,
        required: [true, 'Mobile Number is require']
    },
    password : {
        type: String,
        required: [true, 'Password is require']
    },
    gender : {
        type: String,
        // required: [true, 'Gender is require']
    },
    dob : {
        type: String,
        // required: [true, 'DoB is require']
    },
    userType : {
        type: String,
        // required: [true, 'User Type is require']
    },
    bloodGroup : {
        type: String
    },
    appointmentId : {
        type: Array,
        default : []
    },
    medicalRecordId : {
        type: String
    },
    isAdmin : {
        type: Boolean,
        default : false
    },
    isRootAdmin : {
        type: Boolean,
        default : false
    },
    notification : {
        type: Array,
        default : []
    },
    seenNotification : {
        type: Array,
        default : []
    },
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel;