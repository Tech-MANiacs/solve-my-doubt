const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    firstName:{
        type: String,
        required:[true,'first name is required']
    },
    lastName:{
        type:String,
        required:[true,'first name is required']
    },
    phone:{
        type: String,
        required:[true,'phone number is  required']
    },
    email:{
        type: String,
        required:[true,'email is required']
    },
    website:{
        type: String,
    },
    address:{
        type: String,
        required:[true,'address is required']
    },
    specialization:{
        type: String,
        required:[true,'specialization is required']
    },
    experience:{
        type: String,
        required:[true,'experience is required']
    },
    status:{
        type: String,
        default: 'pending'
    },
    timings:{
        type:Object,
        required:[true,"Work timing is required"]
    },
    DoubtSessionCount:{
        type: Number,
        default: 0
    }
},
{ timestamps : true}
);

const mentorModel = mongoose.model("mentors", mentorSchema);
module.exports = mentorModel;