require("../model/connection").connect();
const config = process.env;
const db = require ('../model/connection')
const upload = require("../middleware/upload");
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('JsonWebToken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const GridFsStorage = require("multer-gridfs-storage");
const {Validator} = require('node-input-validator');
const Grid = require("gridfs-stream");
const auth = require("../middleware/auth");
const indexModel = require('../model/indexModel');
const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');
//const genSalt = bcrypt.genSaltSync(10)
//const imgModel = require('../model/imageModel');

/*Post Method*/
router.post('/signup', upload.single("file"), async (req, res, next)=>{
     
  console.log(req.body)
  try{

     const {first_name,last_name,email, user_name,date_of_birth, password,user_type } = req.body;

     // check if user already exist
     const oldUser = await indexModel.findOne({ email });
      if (oldUser) {
        return res.status(409).json({message:"User Already Exist. Please Enter aother email "});
      }
     const encryptedPassword = await bcrypt.hash(password, 10);
     const data = new indexModel({
      first_name, 
      last_name, 
      email:email.toLowerCase(),
      user_name, 
      password:encryptedPassword,
      /*profile_pic:fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      {
         data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.profile_pic)),
         type: 'image/png/jpg'
      },*/
      date_of_birth,
      user_type})
     
     // Create token
    const token = jwt.sign(
      { data_id: data._id,email},
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      });
    
    // save user token
      data.token = token;
      const dataToSave =await data.save();
      res.json({
        resposeCode:200,
        responseMessage: "Your account Created Succefully ,Please check your email and verify your account to login",
        "data":{
          data
        }
      })
  }catch(err){
    res.status(400).json({message: err.message})
  }

});

//Verify Account
router.post('/verifyAccount',auth, async(req,res,next)=>{

  const {token} = req.body;
   
   // Validate user input
    if (!(token)) {
      res.status(400).json({message:"without verifying user accout user can not logged in"});
    }
    try{
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.data = decoded;
      //return next();
      res.json({
        resposeCode:200,
        responseMessage: "Your account verify Succefully,Please login to access your account",
      });
    }catch(err) {
      res.status(400).json({message:"Invalid token Please Enter valid token"});
    }
})


//Login Api
router.post('/login',auth, async(req, res, next)=>{

  // Our login logic starts here
  
     const {email,user_name,password} = req.body; 
    try{
     const data = await indexModel.findOne(email ? { email,password } : { user_name ,password});
     console.log(req.body)
    
      if (!data) {
           res.send({ msg: 'No user with the email ' + email + ' was found.' });
      }

      if (indexModel.isLocked) {
            return  indexModel.incrementLoginAttempts(function(err) {
                if (err) {
                  return  res.send(err);
                }

              return res.send({ msg: 'You have exceeded the maximum number of login attempts.  Your account is locked until.You may attempt to log in again after that time.' });
            });
        }

      /*if (!indexModel.isVerified) {
            return res.send({ msg: 'Your email has not been verified.  Check your inbox for a verification email.<p><a href="/user/verify-resend/' + email + '" class="btn waves-effect white black-text"><i class="material-icons left">email</i>Re-send verification email</a></p>' });
      }*/
     
     
     if(data && (bcrypt.compare(password, data.password))) {

        // Create token
        let  token = jwt.sign(
            {data_id: data._id,email},
             process.env.TOKEN_KEY,
             {expiresIn: "24h"});
        // save user token
              data.token = token;
        // user
        res.json({
          resposeCode:200,
          responseMessage: "You have logged in Succefully",
          data
        });
     }
  }catch (err) {
      res.status(400).json({message: err.message})
  }

});


/*Post api*/
router.post('/changePassword/:id',auth, async(req,res,next)=>{
        
  try{
      
    const id = req.params.id;
    const {password,new_password,confirm_password} = req.body;
    const v = new Validator({
      password : 'required',
      new_password :  'required',
      confirm_password : 'required|same:new_password'
    });
    console.log(password);
    console.log(new_password);
    console.log(confirm_password);
   
    const matched = await v.check();
     
      if(!matched){
       return res.status(422).send(v.error);
      }
      
      let current_user = id;
      if( await bcrypt.compare(password.toString(),current_user.password)){
        
        let hashPassword = await bcrypt.hash(new_password,10)
          await indexModel.updateOne({
            _id:current_user._id
          },{
          password:hashPassword
          });
          
          return res.status(200).send({
          message:'Password Succefully updated',
          data:{}
        })
  
       const data_id =  indexModel.findOne({id:current_user.id})
        // Create token
        const token = jwt.sign(
          { data_id: data._id},
          process.env.TOKEN_KEY,
          {expiresIn: "24h",
        });
      }else{
        return res.status(400).send({
          message:'Password does not matched',
          data:data_id,
          token:token
        })
      }

      }catch(err){
        return res.status(400).send({
          message:err.message,
          data:err
        });
  }
})

/*Post api*/
router.get('/sendVerificationLink',auth,async(req,res,next)=>{

  const {email} = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: 'dhananjay.sahare.sa@gmail.com',
        password: ''
    }
  });
    var rand,mailOptions,host,link;
    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?email="+rand;
    mailOptions={
      from:'dhananjay.sahare@gmail.com',
      to : email,
      subject : "Please confirm your Email account",
      html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
    }
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(err, response){
     if(err){
        console.log(err);
        res.status(400).json({message:err.message});
      }else{
        console.log("Message sent: " + response.message);
        res.json({
          resposeCode:200,
          responseMessage:"Verify account link sent on your email,Please check your email and verify your account"
        });
      }
    });
});

 

router.post("/upload", upload.single("file"), async (req, res) => {
    if (req.file === undefined) {
      return res.send("you must select a file.");
    }
    const imgUrl = `http://localhost:3000/${req.file.filename}`;
    return res.send(imgUrl);
});


module.exports = router;
