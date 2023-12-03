const app = require('./app')
const dotenv = require('dotenv')
const cloudinary = require('cloudinary')
const connectDatabase = require('./config/database')
const Razorpay = require("razorpay");


// Handling uncaught exceptions

process.on('uncaughtException', (err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down server due to Uncaught Exception`);
    process.exit(1);
})

// config
dotenv.config({path:"src/config/config.env"})

// connecting to database
connectDatabase()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

// Razorpay
//  exports.instance = new Razorpay({
//     key_id:process.env.RAZORPAY_API_KEY,
//     key_secret:process.env.RAZORPAY_SECRET_KEY
// })


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://${process.env.PORT}`);
})  


// unhandled rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down server due to unhandled promise rejection`);

    server.close(()=>{
        process.exit(1);
    });

}) 