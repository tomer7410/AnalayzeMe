var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");
router.get("/",function(req,res){
    
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else{
          // console.log(allCampgrounds)
            res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds, page: 'campgrounds'});
        } 
    
    });
   
    
})


router.get("/new", middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});
router.get("/:id",function(req,res){
   Campground.findById(req.params.id).populate("comments").populate("predictions").exec(function(err,foundCampground){
       if(err){
           console.log(err);
       } else{
            res.render("campgrounds/show",{campground:foundCampground});
       }
   });
    
});
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
    res.render("../views/campgrounds/edit",{campground:foundCampground});
       
    });
  

});
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            console.log("gbtrhb")
            res.redirect("/campgrounds")
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds")
        }
        else{
            res.redirect("/campgrounds");
        }
    })
})

module.exports=router;                      