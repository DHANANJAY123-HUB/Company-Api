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
 
    //res.json({message:"welcome"})
    
   try{
        const test = await userModel.find();
        const data = await indexModel.findOne();
        const testData  = await userModel.find().count();

        console.log(test)
    res.json({
        resposeCode:200,
        responseMessage: "Address report get successfully",
        _id:data._id,
        first_name:data.first_name,
        last_name:data.last_name,
        email: data.email,
        addedAddress:testData,
        Address:test
    })
    } 
    catch(error){
        return res.status(500).json({message: error.message})
    }
   
});


/*Get api */
router.get('/citycount',async (req, res, next) => {
 
    try{
        const test = await userModel.findOne();
        const testData  = await userModel.find({'city':test.city}).count();
           
              
    res.json({
        resposeCode:200,
        responseMessage: "City base report get successfully",
        "data":[{
        city: test.city,
        addressesCound: testData,
    }]
        
    })
        }catch(err){
        res.status(400).json({message:'failed to retrive thr address list'}+err)
        }
    

});


/*Get api */
router.get('/calculateage',async (req, res, next) => {
 
  try{
        /*var dateData = await indexModel.findOne(function calculateAge(year,month,day){
        var currentDate = new Date()
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getUTCMonth()+1;
        var currentDay = currentDate.getUTCDate();

        var age = currentYear - year;
        if(currentMonth> month){
        return age;
        }else{
        if(currentDay >=day){
            return age;
        }else{
            age--
            return age;
        }
    }
})*/
        const data = await indexModel.findOne();
        const testData  = await indexModel.find().count();

        let {page,size,sort} = req.query;
        if(!page){

            page = 1;
        }

         if(!size){

            size = 5;
         }

         const limit = parseInt(size);
         
         const user = await indexModel.find().sort(
            {votes :1, _id:1}).limit(limit)

       
        /*var date_of_birth;

          /* const date = await Date.parse (data.date_of_birth);*/
          /* const date = Datetime.Parse(date_of_birth);*/

        /*const dateData = await indexModel.aggregate( [ 
            { $project: { item: 1, ageDifference: { $subtract: [ new Date(), data.date_of_birth] } } } ] )*/

        //console.log(dateData)*/
              
    res.json({
        resposeCode:200,
        responseMessage: "City base report get successfully",
        totalRecord: testData,
        "data":[{
         _id: data._id,
         first_name: data.first_name,
         last_name:data.last_name,
         email: data.email,
         date_of_birth: data.date_of_birth,
         /*age:  dateData,*/
         page:page,
         size:size,
          Info: user,
         }]
        
        })
        }catch(err){
        res.status(400).json({message:'failed to retrive thr address list'}+err)
        }
    });

//Get by ID Method
router.get('/:id', async (req, res,next) => {
    try{
        const data = await indexModel.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Delete by ID Method
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await indexModel.findByIdAndDelete(id)
        res.send(`Document with ${data.first_name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


module.exports = router;