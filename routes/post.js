const express=require("express")
const router=express.Router()
// const User=require("../models/user")
const bcrypt=require('bcryptjs')
const auth=require('../middleware/auth')
const jwt=require('jsonwebtoken')
const posts=require('../models/post')


router.post('/createpost',auth,(req,res)=>{
   const {title,body,photo}=req.body;
   console.log(title,body,photo)
   if(!title || !body || !photo ){
       return res.status(400).json({error:"Required All Field"})
   }
   const filterUser={
       _id:req.user._id,
       email:req.user.email,
       name:req.user.name,

   }
   console.log("filteruser",filterUser)
   const userPost=new posts({
        title:title,
        body:body,
        photo:photo,
        postedby:filterUser
   })
   userPost.save().then((post)=>{
       res.status(201).send(post)
   }).catch((e)=>{
       console.log(e)
       res.status(400).json({error:e})
   })
})

router.get('/get/allposts',(req,res)=>{

    posts.find({}).populate('postedby',"_id name").sort("-createdAt")
    .then((posts)=>{
        // posts.reverse();
        res.status(200).send(posts)
    }).catch((e)=>{
        console.log(e)
        res.status(400).send(e)
    })
})


router.get('/get/myposts',auth,(req,res)=>{

    posts.find({postedby:req.user._id}).populate('postedby',"_id name")
    .sort("-createdAt")
    .then((posts)=>{
        res.status(200).send(posts)
    }).catch((e)=>{
        console.log(e)
        res.status(400).send(e)
    })
})
router.put('/likes',auth,(req,res)=>{
    const {postId}=req.body;
    const updatadata=posts.findByIdAndUpdate({_id:postId},
        {$push:{likes:req.user._id}},
        {
            new:true
        },
        (err,data)=>{
            if(err){
                return res.status(400).send(err)
            }else{
                return res.status(200).send(data)
            }
        }
        
        )
})
//unlike route

router.put('/unlikes',auth,(req,res)=>{
    const {postId}=req.body;
    const updatadata=posts.findByIdAndUpdate({_id:postId},
        {$pull:{likes:req.user._id}},
        {
            new:true
        },
        (err,data)=>{
            if(err){
                return res.status(400).send(err)
            }else{
                return res.status(200).send(data)
            }
        }
        
        )
})

//add comment 
router.put('/post/comment',auth,(req,res)=>{
    const {text,timestamp,postId}=req.body;
    posts.findByIdAndUpdate({_id:postId},
        {$push:{comments:{text:text,timestamp:timestamp,postuser:req.user.name,postedby:req.user._id}}},
        
        {
            new:true
        }).populate('comments.postedby',"_id name")
        .exec((err,data)=>{
            if(err){
                return res.status(400).send(err)
            }else{
                res.status(200).send(data)
            }
        })
})


//delete post

router.delete('/deletepost/:postId',(req,res)=>{
    posts.findByIdAndDelete({_id:req.params.postId})
    .then((data)=>{
        res.status(200).send(data)
    }).catch((e)=>{
        return res.status(400).send(e)
    })
})




module.exports=router;