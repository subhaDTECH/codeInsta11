const mongoose =require('mongoose')
const  {ObjectId}=mongoose.Schema.Types
const PostSchema=new mongoose.Schema({

     title:{
         type:String,

     },
     body:{
        type:String,
     },
     photo:{
        type:String,
        required:true
     },
     likes:[{type:ObjectId,ref:"Users"}],
     comments:[
         {
             text:String,
             timestamp:{
                 type:String,
                 default:Date.now()
             },
             postuser:String,
             postedby:{
                 type:ObjectId,
                 ref:"Users"
             }


         }
     ],
     postedby:{
         type:ObjectId,
         ref:"Users"
     }
},{timestamps:true})

module.exports=mongoose.model('posts',PostSchema);