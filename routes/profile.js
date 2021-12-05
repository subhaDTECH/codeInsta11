const express=require("express")
const router=express.Router()
// const User=require("../models/user")
const bcrypt=require('bcryptjs')
const auth=require('../middleware/auth')
const jwt=require('jsonwebtoken')
const posts=require('../models/post')
const Users=require('../models/user')



router.get('/user/post',auth,(req,res)=>{

    posts.find({postedby:req.user._id}).populate('postedby',"_id name")
    .then((posts)=>{
        res.status(200).send(posts)
    }).catch((e)=>{
        console.log(e)
        res.status(400).send(e)
    })
})

router.get('/profile/:id',auth,async(req,res)=>{
    const findUser=await Users.findOne({_id:req.params.id});
    // const UserPost=await posts.findOne({_id:req.params.id});
    const UserPost=await  posts.find({postedby:req.params.id}).populate('postedby',"_id name");
    console.log("findUser-->",findUser)
    console.log("UserPost",UserPost)
    if(findUser && UserPost){
        res.status(200).json({User:findUser,userPosts:UserPost})
    }else{
        return res.status(400).json({error:"Errror in find User and profile"})
    }
})











module.exports=router;