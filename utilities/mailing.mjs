import nodemailer from "nodemailer";
import 'dotenv/config'

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});


export const sendEmail = async (to,subject,html)=>{
    const send = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to:to,
        subject:subject,
        html:html
})
    console.log('email sent', send)
}