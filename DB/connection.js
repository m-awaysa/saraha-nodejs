const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connectDb =async (req, res)=>{
   return await mongoose.connect(process.env.DBURI).then(res =>{
    console.log('connected DB');
   }).catch(err=>{
    console.log('failed to connect to DB');
   });
}

module.exports = {connectDb};