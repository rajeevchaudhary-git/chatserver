const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    googleId: { type: String },
    name: { type: String },
    email: { type: String },
    avatar: { type: String },

    password:{
        type:String,
        // required:true,
    },
    
    token:{
     type:String
    },
    isonline:{
        type:String,
       default:'0',
    },
    
},{timeStamp:true},);



module.exports = mongoose.model("User",UserSchema);