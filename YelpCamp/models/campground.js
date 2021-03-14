var mongoose=require("mongoose");
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
var campgroundSchema =new mongoose.Schema({
    name :String,
    description:String,
    createdAt: { type: Date, default: Date.now },
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    predictions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Prediction"
        }
    ],
    importaces:[
        {
            type:Number
        }
        
    ],
    tags:[
        {
            type:String
        }
    ],
   
   

 });
 
   module.exports=mongoose.model("Campground",campgroundSchema);