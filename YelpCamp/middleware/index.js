var Campground=require("../models/campground");
var Comment=require("../models/comment");
var Prediction=require("../models/prediction")
var middlewareObj={};
middlewareObj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id)||req.user.isAdmin){
                    next();
                } else{
                    req.flash("error","you don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}
middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if(foundComment.author.id.equals(req.user._id)||req.user.isAdmin){
                    next();
                } else{
                    req.flash("error","You don't have perrmison to do that do that");
                    res.redirect("back");
                }
            }
        });
        
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}
middlewareObj.checkPredictionOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Prediction.findById(req.params.prediction_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if(foundComment.author.id.equals(req.user._id)||req.user.isAdmin){
                    next();
                } else{
                    req.flash("error","You don't have perrmison to do that do that");
                    res.redirect("back");
                }
            }
        });
        
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");

}
module.exports=middlewareObj