const sgMail = require('sib-api-v3-sdk');
require("dotenv").config()
const {SENDGRID_API_KEY} = process.env

sgMail.ApiClient.instance.authentications['api-key'].apiKey = SENDGRID_API_KEY

const sendEmail = async data => {
    
   const email = {
      ...data,
      sender: { email: "yriyelektric@gmail.com", name: "Yriy" },
      replyTo: { email: "yriyelektric@gmail.com", name: "Yriy" },
    };
     await new sgMail.TransactionalEmailsApi()
       .sendTransacEmail(email)
       .then(() => console.log("Email send success"))
       .catch(error => console.log(error.message));
   };
   
   module.exports = sendEmail;
