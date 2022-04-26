
const mongoose = require('mongoose')

require('dotenv').config();
 
const url = process.env.MONGO_URI

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      /*useCreateIndex: true,
      useFindAndModify: false,*/
    },6000000)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};