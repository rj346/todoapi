const express = require('express');
const router = express.Router(); //using this because we are doing all the operations in router package
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const user_jwt = require('../middleware/user_jwt');
const jwt = require('jsonwebtoken')

router.get('/',user_jwt,async (req,res,next) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // ('-password') ==> this means that password will not get stored in the user
        res.status(200).json({
            success : true,
            user:user
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            msg : "Server Error"
        });
        next();
    }
})

//Authentication 

router.post(`/register`,async(req,res,next) => {
    //console.log(req.body);
    //console.log(req.query); <== when we pass the parameters using query
    const { username, email, password } = req.body; // we can access single body data like 'req.body.email' for email

    try {
        let user_exist = await User.findOne({email:email});
        if(user_exist)
        {
            return res.json({
                success : false,
                msg : 'User already exist'
            });
        }
        else{

            let user = new User();

            user.username = username; 
            user.email = email;

            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(password, salt);

            let size = 200;
            user.avatar = "https://gravatar.com/avatar/?s="+size+'&d=retro';

            await user.save(); //saving the data in the DB

            const payload = {
                user:{
                    id:user.id
                }
            }

            jwt.sign(payload, process.env.jwtUserSecret, {
                expiresIn : 360000
            }, (err,token) => {
                if(err) throw err;
                res.status(200).json({
                    success:true,
                    token:token
                });
            });

            // res.json({
            //     success : true,
            //     msg : 'User Registered',
            //     user : user
            // });
        }
    } catch (err) {
        console.log(err);
    }
});


router.post('/login',async (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        let user = await User.findOne({
            email:email
        });

        if(!user){
            return res.status(400).json({
                success:false,
                msg:'User not exist , Please register'
            });
        }
        else{
            const isMatch = await bcryptjs.compare(password,user.password);

            if(!isMatch)
            {
                return res.status(400).json({
                    success : false,
                    msg : 'Invalid Password'
                });
            }
            else{
                const payload = {
                    user:{
                        id:user.id
                    }
                }

                jwt.sign(payload, process.env.jwtUserSecret, {
                    expiresIn : 360000
                }, (err,token) => {
                    if(err) throw err;
                    res.status(200).json({
                        success:true,
                        msg:'User Logged In',
                        token:token,
                        user:user
                    });
                });
            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success : false,
            msg:'Server Error'
        })
    }
});


//Authorization => we will pass user id to the token that will be saved in our environment variable and after storing we will check it

module.exports = router;