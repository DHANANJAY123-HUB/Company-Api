const express = require('express');
const router = express.Router(); 
const addressModel = require('../model/addressModel')
const indexModel = require('../model/indexModel')
const auth = require('../middleware/auth');

router.post('/address',auth,async(req, res) => {
   console.log(req.body)

    const {title,house_number,building_name, address_line1, address_line2,city, state, zip_code,isDefault } = req.body;
    
    const house = await addressModel.findOne({ house_number });
    if (house) {
      return res.status(409).json({message:'this house_number address already avalible,please enter the another house_number address'});
    }

    const test = new addressModel({
        title,
        house_number,
        building_name,
        address_line1,
        address_line2,
        city,
        state,
        zip_code,
        isDefault
    })
    try{
      const dataToSave =await test.save();
        res.json({
          resposeCode:200,
          responseMessage: "You have added new address successfully",
           "data":{
               addressId:test.id,
               title:test.title,
               houseNumber:test.house_number,
               buildName:test.building_name,
               addressLine1:test.address_line1,
               addressLine2:test.address_line2,
               city:test.city,
               state:test.state,
               zipCode:test.zip_code,
               isDefault:test.isDefault
            }
        });
    }catch(err){
         res.status(400).json({message: err.message})
    }
});

//Update by ID Method
router.patch('/updateAddress/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        const _id = await addressModel.findOne({ id });

        if(!_id){
         res.status(409).json({message:`does not exist ${id} _id in dataBase,please enter the valid _id`});
        }

        const result = await addressModel.findByIdAndUpdate(
            id, updatedData, options
        )
        res.json({
           resposeCode:200,
           responseMessage: `You address ${result.title} updated successfully`,
           "data":{
               addressId:result.id,
               title:result.title,
               houseNumber:result.house_number,
               buildName:result.building_name,
               addressLine1:result.address_line1,
               addressLine2:result.address_line2,
               city:result.city,
               state:result.state,
               zipCode:result.zip_code,
               isDefault:result.isDefault
            }
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})


//Delete by ID Method
router.delete('/deleteMySpecificAddress/:id',auth, async (req, res) => {
    try {
        const id = req.params.id;
        const _id = await addressModel.findOne({id});

        if(!(_id)){
         res.status(409).json({message:`does not exist ${_id} _id in dataBase,please enter the valid _id`});
        }
       
        const result = await addressModel.findByIdAndDelete(id)
        res.json({
           resposeCode:200,
           responseMessage: `Address Data _id ${result.id} has been deleted successfully..`
        })
    }catch (err) {
        res.status(400).json({ message: err.message })
    }
})


/*Get api*/
router.get('/ListMyAddress',auth,async(req,res) => {
    try{
        //const result =await addressModel.find()
        let {page,size,sort} = req.query;
        if(!page){
            page = 1;
        }
        if(!size){
            size = 10;
        }
        const limit = parseInt(size);
        const result =await addressModel.find().sort(
            {votes :1, _id:1}).limit(limit)
        res.json({
            resposeCode:200,
            responseMessage:"Your Address Report generated successfully",
            "data":{
                //result:result,
                page:page,
                size:size,
                Info: result,
                /*addressId:result.id,
                title:result.title,
                houseNumber:result.house_number,
                buildName:result.building_name,
                addressLine1:result.address_line1,
                addressLine2:result.address_line2,
                city:result.city,
                state:result.state,
                zipCode:result.zip_code,
                isDefault:result.isDefault*/
            }
        })
    }catch(err){
        return res.status(500).json({message: err.message})
    }
})

/*Get api */
router.get('/calculateage',auth,async (req, res) => {
 
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
        const addressData = await addressModel.find().count();

        let {page,size,sort} = req.query;
        if(!page){
          page = 1;
        }
        if(!size){
          size = 10;
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
            responseMessage: "User report generated successfully",
            totalRecord: testData,
            addresses:addressData,
            "data":[{
               _id: data._id,
               first_name: data.first_name,
               last_name:data.last_name,
                email: data.email,
               date_of_birth: data.date_of_birth,
               profile_pic:data.profile_pic,
              /* age:  dateData,*/
               page:page,
               size:size,
               Info: user,
            }]
        })
    }catch(err){
         res.status(400).json({message:err.message})
        }
});

//Get by ID Method
router.get('/:id', auth, async (req, res,next) => {
    try{
        const data = await indexModel.findById(req.params.id);
        res.json(data)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router;