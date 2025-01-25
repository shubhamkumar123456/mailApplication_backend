let UserCollection = require('../models/User')
let bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
exports.createUser = async(req,res)=>{
    // res.send("register running")
    const {name ,email ,password} = req.body;

        if(!name || !email || !password ){
            return res.status(400).json({message:"all fields are required"})
        }
      let checkUser = await UserCollection.findOne({email})
      if(checkUser){
        return res.status(403).json({message:"user already registerd"})
      }
   try {


    let data = await UserCollection.create({
        name,
        email,
        password
    })

    res.status(201).json({message:'user created successfully'})
    
   } catch (error) {
    res.status(500).json({message:'error in register user',error:error.message})
   }

}


exports.loginUser = async(req,res)=>{
    const {email, password} = req.body; //12345
try {
    
    let user = await UserCollection.findOne({email}) //null , database object
    if(user){
        let comparesPassword = bcrypt.compareSync( password, user.password ) //true , false
        if(comparesPassword){

            let token = jwt.sign({ _id: user._id, email: user.email}, process.env.JWT_SECRET,{expiresIn:'24h'});
            res.status(200).json({message:"login successfull", token,expiresIn:'1d'})
        }
        else{
            res.status(401).json({message:'wrong password'})
        }
    }
    else{
        return res.status(404).json({message:"user not found"})
    }
} catch (error) {
    res.status(500).json({message:"error in login user",error:error.message})
}

}


exports.updateUser = async(req,res)=>{
    const {name ,password} = req.body;
    // const _id = req.params._id;
    const {_id,email} = req.user
try {
    let user = await UserCollection.findById(_id);
        if(user){
            if(name){
                user.name = name
            }
            if(password){
                user.password = password
            }
          
            await user.save()
        }
        else{
            res.status(400).json({message:"user not found"})
        }
    res.status(200).json({message:"user updated successfully"})
} catch (error) {
    res.status(500).json({message:"error in login user",error:error.message})
}

}


exports.deleteUser = async(req,res)=>{
    const {_id}  = req.user
    console.log(_id)
   try {
    await UserCollection.findByIdAndDelete(_id)
    res.status(200).json({message:"account deleted successfully"})
   } catch (error) {
    res.status(500).json({message:"error in deleting user",error:error.message})
   }

}


exports.getUserDetails = async(req,res)=>{
    const {_id}  = req.user;

 try {
    let user = await UserCollection.findById(_id);
    res.status(200).json({message:"successfully",user})
 } catch (error) {
    res.status(500).json({error:error.message,message:"error in getting user"})
 }
}
