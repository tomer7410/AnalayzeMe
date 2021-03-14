Campground=require("../models/campground");
var express=require("express");
var router=express.Router();
var passport=require("passport");
const { check, validationResult } = require('express-validator/check');
var User=require("../models/user");
var middleware=require("../middleware");
var errArr=null;
var Chart=require("chart.js")
router.get("/",function(req,res){
    res.render("landing");
})
router.get("/chart",function(req,res){
    
        res.render("a")

        
})
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

//============
// AUTH ROUTES
//============

//show register form
router.get("/register",function(req,res){
    
    res.render("register",{errArr:errArr});

});

//handle sign up logic

 //handle sign up logic
router.post("/register",[
    check('firstName').not().isEmpty().withMessage('Name must have more than 5 characters'),
    check('email', 'Your email is not valid').not().isEmpty().isEmail().normalizeEmail(),
    check('password', 'Your password must be at least 5 characters').not().isEmpty().isLength({min: 5}),
  ],
   function(req, res){
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
         errArr=errors.array();
        console.log(errArr)
        return res.render("register",{errArr:errArr});
    }
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode==='secretCode123'){
        newUser.isAdmin=true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message,errArr:errArr});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// show login form
router.get("/login",function (req,res){
  res.render("login", {page: 'login'});  
});
router.post("/login", passport.authenticate("local",
{  
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){

});
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/campgrounds");
});

module.exports=router;