const router = require('express').Router(); //importing router
const bcrypt = require('bcryptjs'); // importing bcrypt
const User = require('../model/User'); //importing usermodels
const { LoginValidation,RegisterValidation } = require('../utils/UserValidation'); //importing User validations
const jwt = require('jsonwebtoken');

//User Register
router.post('/register',async (req,res)=> {
     let resp={}
   //Lets validate the data before saving the user
  const { error } = RegisterValidation(req.body);
  if(error)
  {
    resp['status'] = '06';
    resp['message'] = error.message;
    return res.status(400).send(resp);
  }
  //Check if user already exist in the system
  const emailExist = await User.findOne({email:req.body.email})

  //Check if number already exist in the system
  const numberExist = await User.findOne({telephoneNumber:req.body.telephoneNumber});
  if(emailExist)
  {
    resp['status'] = '06';
    resp['message'] = "User already exists";
    return res.status(400).send(resp);
  }

  else if (numberExist)
  {
    resp['status'] = '06';
    resp['message'] = "Number already exists";
    return res.status(400).send(resp);
  }
  else
  {

   //Hash passwords
   const salt = await bcrypt.genSalt(10); // first, generate salt
   const hashedPassword = await bcrypt.hash(req.body.password,salt);


 const user = new User({
   username:req.body.username,
   email:req.body.email,
   telephoneNumber:req.body.telephoneNumber,
   role:req.body.role,
   password:hashedPassword

 });

 //save user in database
 try {
   const savedUser = await user.save().then(()=>{
      resp['status']= '01';
      resp ['message'] ="User Successfully Registered";
     return res.status(201).send(resp);

   });

 } catch (error) {
    res.status(400).send(error.message+" "+"[Admin or User is Expected]");
 }

  }

});

//User Login
router.post('/login',async (req,res)=> {
  let resp={}
  //Lets validate the data before saving the user
 const { error } = LoginValidation(req.body);
 if(error)
 {
   resp['status'] = '06';
   resp['message'] = error.message;
   return res.status(400).send(resp);
 }
 //Check if user already exist in the system
 const user = await User.findOne({email:req.body.email})

 if(!user)
 {
   resp['status'] = '06';
   resp['message'] = "User account not found! Check your email or password";
   return res.status(401).send(resp);
 }
  //Check for valid passwords
  const validPassword = await bcrypt.compare(req.body.password,user.password);

  if(!validPassword)
  {
   resp['status'] = '06';
   resp['message'] = "Incorrect password";
   return res.status(400).send(resp);
  }
 
    //creating a jsonwebtoken
    const token = jwt.sign({username:user.username,_id:user._id,role:user.role},process.env.TOKEN_SECRET)
    
    // return jwt token to user.
    resp['status']='01';
    resp['message']='Login Successful';
    resp['token']= token;
    return res.send(resp);
  

});
module.exports = router;