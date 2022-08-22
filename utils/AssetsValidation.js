const Joi = require('joi');


//Assets validation
const AssetsValidation = (data)=>{

    const assetSchema = Joi.object({

        name: Joi.string()
                     .trim(true)
                     .min(4)
                     .required(),
        typeofasset: Joi.string()
                     .min(4)
                     .max(255)
                     .trim(true)
                     .required(),

        description:Joi.string()
                     .min(5)
                     .trim(true)
                     .required(),
              issues:Joi.array()
                      .min(5),

             user:Joi.string()
                     .trim(true),
      });
       //Validate
     return assetSchema.validate(data)
}
//export asset.
module.exports.AssetsValidation = AssetsValidation;