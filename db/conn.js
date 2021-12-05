const mongoose =require("mongoose")

mongoose.connect(process.env.MONGOURL,{
    useCreateIndex:true,
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:false
}).then(()=>{
    console.log(" connection connected successfully")
}).catch((e)=>{
    console.log(e)
})

// k3p8uB6zNTm3cqNH
// mongodb+srv://admin:<password>@cluster0.i63a7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority