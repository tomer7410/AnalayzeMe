
var multer = require('multer'),
    messages = [],
   xlstojson = require("xls-to-json-lc"),
   xlsxtojson = require("xlsx-to-json-lc");
   csvToJson = require('convert-csv-to-json');
   var express=require("express");
   var router=express.Router();
   var Campground=require("./models/campground");
   const path = require('path')
   const { spawn } = require('child_process');

    function runScript(learnType,filepath,toTrasformed,CategorialData,colTindex,nOfcol,unUsedCol,name){
              return spawn('python', [
                "-u", 
                path.join(__dirname,  "random_forest_regression.py"),
                filepath,toTrasformed,CategorialData,colTindex,nOfcol,unUsedCol,learnType,name]);         
  }
   var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './routes/uploads/')
        
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    },
    
});
var upload = multer({ //multer settings
                storage: storage,
                fileFilter : function(req, file, callback) { //file filter
                    if (['xls', 'xlsx','csv'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        return callback(new Error('Wrong extension type'));
                        
                    }
                 
                    callback(null, true);
                }
                

            }).single('file');
/** API path that will upload the files */
router.post('/', function(req, res) {
    
    upload(req,res,function(err){
        var returnedData=""
        var learnType=req.body.learnType
        var toTrasformed=false
        var CategorialData=''
        var colTindex=''
        if(err){
            messages.push("You can send only exel files ");
        }
        /** Multer gives us file info in req.file object */
        if(!req.file){
            messages.push("You have to send a file")
        } 
        if( req.body.name==""){
            messages.push("You have to pick  a name ")
        }
        if( req.body.numOfInVar==""){
            messages.push("You have to mention how many independent variables you have")
        }
        if(learnType=="Learning Type"){
            messages.push("You have to pick  a learning type ")
        }
        if(req.body.unUsedVarIndex!=""){
            if (req.body.unUsedVarIndex>req.body.numOfInVar-1){
                messages.push("Impossible indexes ")
            }
        }
        
        /** Check the extension of the incoming file and 
         *  use the appropriate module
         */
       
        if(req.body.coltRadio==1){
          //there is column to transform
            if(req.body.CategorialData==''){
                messages.push("You mentioned that you have data to transform but you did not specify what ")
            }
            if(req.body.colTindex>req.body.numOfInVar-1||req.body.colTindex==req.body.unUsedVarIndex){
                messages.push("Impossible indexes ")
            }
             
            toTrasformed=true
            CategorialData=req.body.CategorialData
            colTindex=req.body.colTindex
            

          }
        else{
            // //there is no column to transform
            toTrasformed=false
        } 
        if(messages.length>0){
            req.flash("error",messages)
            messages.length=0;
           return  res.redirect("/campgrounds/new")

        }

        const subprocess = runScript( req.body.learnType,req.file.path,toTrasformed,CategorialData,colTindex,req.body.numOfInVar,req.body.unUsedVarIndex,req.body.name);

        subprocess.stdout.on('data', function (data) {
         
         returnedData=returnedData.concat(data);
         
        });
      
        subprocess.on('close', function () {
         NumericArr=[]
         returnedData=returnedData.split('\r\n')
         returnedData= returnedData.filter(function (el) {
            return el != "";
          });
          if (returnedData[0]!=-1){
            nOfnumericEl=0;
            returnedData.forEach(element => { 
              if(!isNaN(element)){
                      nOfnumericEl=nOfnumericEl+1;
                  }
            });
            NonNumericArr=returnedData.splice(nOfnumericEl)
            var name=req.body.name;
             var author= {
                  id:req.user._id,
                  username:req.user.username
            } 
                
              var newCampground={
                  name:req.body.name,
                  importaces:returnedData,
                  tags:NonNumericArr,
                  author:author
              }
              Campground.create(newCampground,function(err,newlyCreated){
                    if(err){
                          console.log(err);
                    }else{
                        
                      return  res.redirect("/campgrounds")
                    }
              });
            
          }
          else{
            req.flash("error","something went wrong with the file")
            messages.length=0;
           return  res.redirect("/campgrounds/new")

        }
         
             
            
      }); 
    })
});

router.get('/',function(req,res){
     
     res.render( "../views/upload");
    
});

module.exports=router; 