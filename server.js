const express = require('express'); //importing expressjs
//const colors = require('colors'); //importing colors
const morgan = require('morgan'); //importing morgan
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express(); // by using it we will create a server

/*app.use((req,res,next)=>{
    console.log("middleware ran");

    next();
});*/

app.use(morgan('dev')); // will print the request coming to the server

app.use(express.json({}));
app.use(express.json({
    extended: true
}))

dotenv.config({
    path: './config/config.env'
});

connectDB();

// app.get('/todo',(req,res)=>{
//     res.status(200).json({
//         "name":"Rajat"
//     });
// }); <=== will do this route thing in some different module named route

// https://localhost:3000/api/todo/auth/register

app.use('/api/todo/auth',require('./routes/user'));

const PORT = process.env.PORT || 3000; // process.env.PORT => this will the PORT allocated to it by the server || by default it will take 3000

app.listen(PORT,console.log(`Server is running on port : ${PORT}`.red.underline.bold));