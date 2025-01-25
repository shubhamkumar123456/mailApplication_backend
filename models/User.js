const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');


const userSchema = new mongoose.Schema({
   name:{
    type:String,
    trim:true,
    required:true,

   },
   email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: (props) => `${props.value} is not a valid email!`,
    },
   },
   password:{
    type:String,
    required:true,
   }

},{timestamps:true});

userSchema.pre('save', function(next){
 
   if(!this.isModified('password')){
      return next()
   }
   const salt = bcrypt.genSaltSync(10);
   this.password = bcrypt.hashSync(this.password, salt)
   next()
})

userSchema.add({
   sendMails:{
      type:[
         {
            type:mongoose.Schema.Types.ObjectId,
            ref:"mails"
         }
      ]
   },
   recieveMails:{
      type:[
         {
            type:mongoose.Schema.Types.ObjectId,
            ref:"mails"
         }
      ]
   },

})

module.exports = mongoose.model( 'users' ,userSchema );