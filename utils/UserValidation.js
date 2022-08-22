const Joi = require('joi'); // importing validation tool joi

//Register validation
const RegisterValidation = (inputDetails)=>{

    const regschema = Joi.object({

        username: Joi.string()
                     .trim(true)
                     .min(6)
                     .max(30)
                     .required(),
        email: Joi.string()
                     .email()
                     .min(6)
                     .max(30)
                     .trim(true)
                     .required(),
            role:Joi.string()
                     .default("user"),
                     
                     

        telephoneNumber:Joi.string()
                     .length(10)
                     .pattern(/[0-9]{1}[0-9]{9}/)
                     .trim(true)
                     .required(),
        password: Joi.string()
                     .trim(true)
                     .min(6)
                     .max(20)
                     .required(),
       
      });
       //Login Validation
     return regschema.validate(inputDetails);
}

//Login validation
const LoginValidation = (inputDetails)=>{

    const logschema = Joi.object({

        email: Joi.string()
                     .email()
                     .min(6)
                     .max(30)
                     .trim()
                     .required(),
        password: Joi.string()
                     .min(6)
                     .max(30)
                     .required(),
      });
       //v
     return logschema.validate(inputDetails);
}

module.exports.RegisterValidation = RegisterValidation;
module.exports.LoginValidation = LoginValidation;
