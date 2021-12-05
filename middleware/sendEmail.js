const nodemailer=require("nodemailer")
require('dotenv').config()
const {SMTP_PORT,SMTP_SERVICE,SMTP_USER,SMTP_PASS}=require("../util/keys")
const sendEmail=async(options)=>{

    let transporter = nodemailer.createTransport({
        service:SMTP_SERVICE,
       
        port:SMTP_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
          user:SMTP_USER, // generated ethereal user
          pass: SMTP_PASS, // generated ethereal password SMTP_PASS
        },
      });


     


            await transporter.sendMail({
            from: "Code_Instagram@gmail.com", // sender address
            to:options.email, // list of receivers
            subject: options.subject, // Subject line
            text: "Welcome to Code_Instagram" , // plain text body
            html: `${options.message} `, // html body
          });




}

module.exports=sendEmail;