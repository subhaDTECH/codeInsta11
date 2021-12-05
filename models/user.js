const jwt = require("jsonwebtoken");
const mongoose =require("mongoose")
const  {ObjectId}=mongoose.Schema.Types
const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    resetToken:String,
    expireToken:Date,
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    followers:[{type:ObjectId,ref:"Users"}],
    following:[{type:ObjectId,ref:"Users"}],
})

UserSchema.methods.generateToken=async function(){
    try{
        const token=await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;

    }catch(e){
        console.log(e)

    }

  

    
}

module.exports=mongoose.model('Users',UserSchema);