const jwt = require('jsonwebtoken');
const User = require('../model/User');

//Token Verification Middleware
exports.Auth = async(req,res,next)=>{
    //get token from header // checks if token is included in the post,get request
    const token = req.header('auth-token');
    if(!token)
    {
        return res.status(401).send("Unable To Access This Page !");
    }
    else
    {
        try {
             //if token exists, then verify it
        const Verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = Verified;
        //hit next after verification
        next();
        } catch (error)
        {
            return res.status(400).send("Invalid Token !");
        }
         }

}

//Admin Middleware
exports.isAdmin = (req,res,next)=>{
         if(req.user.role==="user")
         {
            return res.status(401).send("Access Denied! You must be an admin.");
         }
         next();
}
exports.isUser = (req,res,next)=>{
    if(req.user.role==="Admin")
    {
       return res.status(401).send("Access Denied! You must be a user to submit an issue.");
    }
    next();
}