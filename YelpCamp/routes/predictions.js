var Campground=require("../models/campground");
var Prediction=require("../models/prediction");
var express=require("express");
var middleware=require("../middleware")
var router=express.Router({mergeParams:true}); const { spawn } = require('child_process');
function filter(arr,char){
    arr = arr.filter(function (el) {
        return el != char;
      });
      return arr
}
const path = require('path')

//==============
//PREDICTION ROUTES

//================
router.get("/new",middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.render("predictions/new",{campground,campground});
            
        }
   });
});
router.post("/",middleware.isLoggedIn,function(req,res){
   Campground.findById(req.params.id,function(err,campground){

       if(err){
           console.log(err);
           res.redirect("/campgrounds/campgrounds");
       }else{
       
           if(req.body.input==''){
            req.flash("error",'You have to send somthing')
           return  res.redirect('/campgrounds/'+campground._id+'/predictions/new');

           }
        allData=""
          
            const a= spawn('python', [
           "-u", 
            path.join(__dirname, 'predict.py'),req.body.input,campground.name]);
         
             a.stdout.on('data', function (data) {
                
                allData=allData.concat(data);
             });
             a.on('close',function(){
                allData=allData.split('\r\n')
                officalData = allData.filter(function (el) {
                    return el != '';
                  });
             if(officalData[0]!=-1){
                var author={
                    id:req.user._id,
                    username:req.user.username
                } 
                  var newPrediction={
                    resualt:officalData.shift(),
                    NormedData:officalData,
                    author:author,
                  }
              Prediction.create(newPrediction,function(err,prediction){
                  if(err){
                      console.log(err);
                  }else{
                      console.log(prediction)
                    prediction.save();
                      campground.predictions.push(prediction);
                      console.log(campground.predictions)
                      campground.save();
                      req.flash("success","Successfully added prediction")
                      res.redirect('/campgrounds/'+campground._id);
                  }
              })
             }
             else{
                req.flash("error",'somthing went wrong with the details')
                return res.redirect('/campgrounds/'+campground._id+'/predictions/new');
             }    
               
             })
            
       }
   }) 
});
router.delete("/:prediction_id",middleware.checkPredictionOwnership,function(req,res){
    Prediction.findByIdAndRemove(req.params.prediction_id,function(err){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/"+req.params.id,);
        }
    })
})

module.exports=router;