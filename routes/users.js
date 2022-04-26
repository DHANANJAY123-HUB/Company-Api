var express = require('express');
require("../model/connection").connect();
var router = express.Router(); 
var userModel = require('../model/userModel')
var indexModel = require('../model/indexModel')
//var bodyParser = require('body_parser');


/* GET api. */
router.get('/address', (req, res, next) =>{
  res.send("Welcome")
});


/*Post api. */
router.post('/address',async(req, res, next)=>{
   console.log(req.body)

   const {title,house_number,building_name, address_line1, address_line2,city, state, zip_code } = req.body;

    const test = new userModel({
        title,
        house_number,
        building_name,
        address_line1,
        address_line2,
        city,
        state,
        zip_code,
    })
    try{
      const dataToSave =await test.save();
        res.status(200).json({message:"Address Successfully Saved"})

    } catch(error){
       res.status(400).json({message: error.message})
  }
  
});


/*Get api */
router.get('/addresscount',async (req, res,next)=> {
 
    res.json({message:"welcome"})
    
   try{
        const data = await userModel.find();
        console.log(data)
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
   
});


/*Get api */
router.get('/citycount',async (req, res, next) => {
 
 
   console.log("welcome")
   userModel.find((err,docs)=>{
        if(!err){
            
            console.log(docs)
              try{
             res.status(200).json("list",{
               "city":docs.city,
               message:"City base report get successfully",
             });
            
        }catch(err){
        res.status(400).json({message:'failed to retrive thr address list'}+err)
        }
    }
    });

});


/*Get api */
router.get('/calculateage',async (req, res, next) => {
 
  console.log("welcome")
  indexModel.find((err,docs)=>{
        if(!err){
            
            console.log(docs)
              try{
             res.status(200).json("list",{
               data:docs.dotos,
               message:"City base report get successfully",
             });
            
        }catch(err){
        res.status(400).json({message:'failed to retrive thr address list'}+err)
        }
    }
    });

});

module.exports = router;