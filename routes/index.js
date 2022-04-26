require("../model/connection").connect();
const db = require ('../model/connection')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('JsonWebToken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = require('multer');

const auth = require("../middleware/auth");

const indexModel = require('../model/indexModel')

/* GET home page. */
router.get('/signup', (req, res, next)=>{
  console.log("Server is started")
  res.send("Welcome")
});



/*Post Method*/
router.post('/signup', async (req, res, next)=>{
     console.log(req.body)

     const {first_name,last_name,email, user_name, profile_pic,date_of_birth, password } = req.body;

     // check if user already exist
    // Validate if user exist in our database
    const oldUser = await indexModel.findOne({ email });
    

   
    if (oldUser) {
      return res.status(409).json({message:"User Already Exist. Please Login Please Enter aother email "});
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
 
  const data = new indexModel({
        first_name, 
        last_name, 
        email,
        user_name,
        password: encryptedPassword,
        profile_pic,
        date_of_birth,
  });
     // Create token
    const token = jwt.sign(
      { data_id: data._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    // save user token
    data.token = token;
    res.status(201).json(data);

 
  try{
      const dataToSave =await data.save();
      res.status(200).json({message:"User Details Successfully Saved"})
     }catch(error){
       res.status(400).json({message: error.message})
     }

});

router.post('/login', async(req, res, next)=>{

  // Our login logic starts here
  
    // Get user input
    const { email, password } = req.body;
      console.log(req.body)

   
    // Validate user input
    if (!(email && password)) {
      res.status(400).json({message:"All input is required"});
    }
    

    //Condition apply
   // let conditions = !!user_name ? {user_name: user_name} : {email: email};

    indexModel.findOne({email:email, password:password},function(err, doc){
      if(err) throw err;
        if(doc) {
            res.status(200).json({message:"Successfully Login "});
        } else {
            res.status(400).json({message:"Invalid Credentials Please Enter ReLogin"});
        }

    });

   /* const data = await indexModel.findOne({ email:email,password:password });

    if (data && (await bcrypt.compare(password, data.password))) {
      // Create token
      const token = jwt.sign(
        { data_id: data._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

      // save user token
      data.token = token;

      // user
      return res.status(200).json({message:"Successfully Login User"});
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here*/
   
});

  

module.exports = router;
