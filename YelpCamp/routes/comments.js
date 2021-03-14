var Campground=require("../models/campground");
var Comment=require("../models/comment");
var express=require("express");
var middleware=require("../middleware")
var router=express.Router({mergeParams:true});
//==============
// COMMENTS ROUTES
//================
router.get("/new",middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new",{campground,campground});
            
        }
   });
});
router.post("/",middleware.isLoggedIn,function(req,res){
   Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds/campgrounds");
       }else{
          Comment.create(req.body.comment,function(err,comment){
              if(err){
                  console.log(err);
              }else{
                  comment.author.id=req.user._id;
                  comment.author.username=req.user.username;
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("success","Successfully added comment")
                  res.redirect('/campgrounds/'+campground._id);
              }
          })
       }
   }) 
});
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.render("../views/comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    })
})
router.put("/:comment_id",function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedCampground){
        if(err){
            res.redirect("back")
        } else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

module.exports=router;