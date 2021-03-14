var mongoose=require("mongoose");
var predictionSchema=mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    author:{
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"  
        },
        username:String
    },
    
    resualt:Number
    ,
    NormedData:[
        {
            type:String 
        }
    ]


});
module.exports=mongoose.model("Prediction",predictionSchema); 