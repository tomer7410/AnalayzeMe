var express   =require("express"),
    app       =express(),
    bodyParser=require("body-parser"),
    flash=require("connect-flash"),
    mongoose=require("mongoose"),
    passport=require("passport"),
   LocalStrategy=require("passport-local"),
   methodOverride=require("method-override"),
    Campground=require("./models/campground"),
    Comment=require("./models/comment"),
    User=require("./models/user"),
    seedDB=require("./seed")
var commentsRoutes=require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    predictionRoutes=require("./routes/predictions")
    indexRoutes=require("./routes/index") ,   
    uploadRoutes=require("./upload");  
//mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"));
app.use(flash());
// seedDB()
app.locals.moment = require("moment");
//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret:"Once again Rusty wins cutest dog!",
  resave:false,
   saveUninitialized:false 
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})
app.use(indexRoutes);
app.use("/upload",uploadRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);
app.use("/campgrounds/:id/predictions",predictionRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(bodyParser.json());

app.listen(3000,"localhost",function(){
    console.log("The YelpCamp Has Started!");
})
