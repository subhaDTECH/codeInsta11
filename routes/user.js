const express=require("express")
const router=express.Router()
const Users=require("../models/user")
const bcrypt=require('bcryptjs')
const auth=require('../middleware/auth')
const jwt=require('jsonwebtoken')
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const sendEmail=require("../middleware/sendEmail")
const crypto=require("crypto")

require('dotenv').config()

const options = {
    auth: {
        api_key: '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'
    }
}

const mailer = nodemailer.createTransport(sgTransport(options));






// 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
router.post('/signup',(req,res)=>{
     const {name,email,password}=req.body;
     console.log(req.body)
     if(!name || !email || !password){
         return res.status(400).json({error:"Please fill the all field"})
     }
     Users.findOne({email:email})
     .then((UsersExit)=>{
         if(UsersExit){
            return res.status(400).json({error:"Email Already Exits"})
         }
         bcrypt.hash(password,10).then((hashpass)=>{
             const NewUsers=new Users({
                 name:name,
                 email:email,
                 password:hashpass
             })
             NewUsers.save().then((SaveUser)=>{
               
                  sendEmail({
                      email:SaveUser.email,
                      subject:" welcome to Code_Instagram ",
                      message:"Your Register succssfully"
                  });
                 res.status(201).send(SaveUser)

             }).catch((e)=>{
                 return res.status(400).json({error:"User Not Saved"})
             })
         })

     }).catch((e)=>{
         console.log(e)
     })
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({error:"All Field require"})
    }
    Users.findOne({email:email}).then((userExit)=>{
         if(!userExit){
            return res.status(400).json({error:"User Not Exits"})
         }
         bcrypt.compare(password,userExit.password).then((LoginUser)=>{
              if(!LoginUser){
                   return res.status(400).json({error:'invalid email or password'})
              }
              
              //create token 
            //  const token= jwt.sign({_id:LoginUser._id},process.env.SECRET_KEY)
            //  res.header('auth-token',token).status(200).json({token:token})
            userExit.generateToken().then((token)=>{
                console.log(token)
                res.cookie('token',token,{
                    expires:new Date(Date.now()+300000000),
                    httpOnly:true
                })
                res.status(200).send({token:token})
            })
              
            
              


         })
    }).catch((e)=>{
        console.log(e)
    })
})
router.get('/about',(req,res)=>{
    res.status(200).send(req.user)
})


router.get('/auth',auth,(req,res)=>{
    console.log("coming")
    res.status(200).send(req.user);
    console.log("cookie",req.cookies.token)
    
})

//follow user

router.put('/follow',auth,(req,res)=>{
    Users.findByIdAndUpdate({_id:req.body.followId},{
        $push:{followers:req.user._id}
    },{new:true},(err,data1)=>{
        if(err){
            return res.status(400).json({error:err});
        }
        Users.findByIdAndUpdate({_id:req.user._id},{
            $push:{following:req.body.followId}
        },{new:true}).then((data2)=>{
            res.status(200).json({
                data1,
                data2
            })
        }).catch((e)=>{
            return res.status(400).json({error:err});
        })



    })
})


//unfolloow user
router.put('/unfollow',auth,(req,res)=>{
    Users.findByIdAndUpdate({_id:req.body.unfollowId},{
        $pull:{followers:req.user._id}
    },{new:true},(err,data1)=>{
        if(err){
            return res.status(400).json({error:err});
        }
        Users.findByIdAndUpdate({_id:req.user._id},{
            $pull:{following:req.body.unfollowId}
        },{new:true}).then((data2)=>{
            res.status(200).json({
                data1,
                data2
            })
        }).catch((e)=>{
            return res.status(400).json({error:err});
        })



    })
})



//reset token 

router.post('/password/reset',(req,res)=>{
   crypto.randomBytes(32,(err,buffer)=>{
      if(err){
          return res.status(400).json({message:"Internal server Error"})
      } 
      const token=buffer.toString("hex");
       
      Users.findOne({email:req.body.email}).then((user)=>{
          console.log(user,"email find")
          if(!user){
              return res.status(400).json({message:"User not exit  check your email "})
          }

          user.resetToken=token;
          user.expireToken=Date.now()+ 20 *60*1000;
           
          user.save().then((result)=>{
           
            let message=`Click this below  link to rest Your password \n\n
             <h2> <a href="http://localhost:3000/password/reset/${token}">CLICK THIS LINK</a> </h2>
            
            `
            sendEmail({
                email:result.email,
                subject:"password  Reset ",
                message:message

            })
            res.status(200).json({
                message:"Check Your Mail"
            })
          })


      })

   })

})


//reset password

router.put('/password/reset/:token',(req,res)=>{

    const token=req.params.token;
    console.log(token)

  Users.findOne({resetToken:token}).then((result)=>{
      if(!result){
          return res.status(400).json({message:"Token invalid or Expire"})
      }

      if(req.body.password!==req.body.confirmerdPass){
          return res.status(400).json({message:"Password does not match"})
      }
    

      //hash pass and save to user
      bcrypt.hash(req.body.password,10).then((hashpass)=>{
             
        result.password=hashpass;
        result.resetToken=undefined;
        result.expireToken=undefined;

        result.save().then((user)=>{
            res.status(200).json({message:"Password reset successfully"})
            console.log(user,"ufter pass update")

        }).catch((e)=>{
           console.log("error while save ",e) 
        })
      }).catch((e)=>{
        console.log("error while hash ",e) 
     })

  }).catch((e)=>{
      console.log(e)
      res.status(400).json({message:"Internal error while password reset update",e})
  })

})


module.exports=router;