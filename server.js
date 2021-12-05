const express=require("express")
const app=express()
const port =process.env.PORT || 5000;
const cookieParser=require("cookie-parser")
const cors=require('cors')


require('dotenv').config()
const auth=require('./middleware/auth')
const router=require("./routes/user")
const postsRouter=require('./routes/post')
const profileRouter=require('./routes/profile')


//db
require('./db/conn')


//md
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(router)
app.use(postsRouter)
app.use(profileRouter)

//route
app.get('/',auth,(req,res)=>{
    console.log("coming")
    res.status(200).send(req.user);
    console.log("cookie",req.cookies.token)
    
})

//listen port

app.listen(port,()=>{
    console.log(`server run on port ${port}`)
})