var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

function seedDB(){
    Campground.remove({},function(err){
        if(err){
            console.log(err)
        }
        console.log("removed campgrounds!");
    //     data.forEach(function(seed){
    //         Campground.create(seed,function(err,campground){
    //             if(err){
    //                 console.log(err);
    //             }else{
    //                console.log("added a campground");
    //                Comment.create({
    //                    text:"this place is great,but i wish there was internet",
    //                    author:"tomer"
    //                 },function(err,comment){
    //                     if(err){
    //                         console.log(err)
    //                     }else{
    //                         campground.comments.push(comment);
    //                         campground.save();
    //                         console.log("added a comment")
    //                     }
                      
    //                 });
    //             }
    //         });
    //      });
            
     });
    
}
module.exports=seedDB;