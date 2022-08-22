const mongoose = require('mongoose'); //import mongoose

//creating an asset schema to make the work simple
const AssetsSchema = mongoose.Schema({
    
    name:{
        type: String,
        required:true,
        min:4
    },
    typeofasset:{
        type:String,
        required:true,
        min:4,
        max:255
    },
    description:{
        type:String,
        required:true,
        min:5
    },
    issues:{
        type:Array,
        date:Date.now()
        
    },
    user:{
        //creator will be linked to assets to be sure of who created and has access to it.
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Date:{
        type: Date,
        default:Date.now()
    }
});

module.exports = mongoose.model("Asset",AssetsSchema);