const jwt=require("jsonwebtoken")
const User=require('../models/user')
// module.exports=(req,res,next)=>{

// const { JsonWebTokenError } = require("jsonwebtoken")

    
//     const {authorization}=req.headers;
//     if(!authorization){
//        return res.status(200).send('You must be Logged In')
//     }

//     const bearer=authorization.split(' ');
//     const token=bearer[1]
//     console.log(token)
//       jwt.verify(token,process.env.SECRET_KEY,(err,payload)=>{
//           if(err){
//               return res.status(400).send("You need to looged in")
//           }
//           console.log(payload)
//           const {_id}=payload;
//           User.findById({_id:_id}).then((user)=>{
//               console.log(user)
//               req.user=user;
//               next();
//           })
//       })

// }

const auth=async(req,res,next)=>{

     try{
        const token= req.cookies.token;
        const UserVerify=await jwt.verify(token,process.env.SECRET_KEY);
        if(!UserVerify){
            return res.status(400).json({error:"InValid token"})
        }
        const UserData=await User.findOne({_id:UserVerify._id,"tokens.token":token});
        console.log(UserData)
        req.user=UserData;
        req.userId=UserData._id;
        next();

     }catch(e){

         console.log(e)
         res.status(400).send(e)
     }
    
}
module.exports=auth;