const express = require('express');
const router = new express.Router(); 
const Database = require('../Database');
const jsonwebtoken = require('jsonwebtoken');
const ExpressError = require('../ExpressError');
const config = require('../config');


router.post('/login', async (req, res, next)=>{
    const {email, password} = req.body;
    if(!email || !password) return next(new ExpressError('Missing Parameters', 404));
    try{
        let user = await Database.authenticate(email, password); 
        if(user){
            let token = jsonwebtoken.sign({id: user.id, email}, config.secretKey);
            return res.json({token, id: user.id, success: true});
        }
        else{
            res.json({success: false})
        }
    }   
    catch(error){
        return next(error);
    }
});

router.post('/create-user', async (req, res, next)=>{
    const {email, password} = req.body; 
    if(!email || !password) return next(new ExpressError('Missing Parameters', 404));
    try{
        let user = await Database.createUser(email, password);
        if(user){
            return res.json({success: true});
        }
        else{
            res.json({success: false})
        }
    }   
    catch(error){
        return next(error);
    }
});

module.exports = router;