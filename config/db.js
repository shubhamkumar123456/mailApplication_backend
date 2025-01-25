const mongoose = require('mongoose');


async function connectToDb(){
 try {
   // || 'mongodb://127.0.0.1:27017/mailBox'
    let connection = await  mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb successfully')
 } catch (error) {
    console.log('error in connecting mongodb ', error)
 }
 
} 

module.exports = connectToDb