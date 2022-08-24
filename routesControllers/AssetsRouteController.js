const route = require("express").Router(); //import router
const Assets = require("../model/Assets");
const { Auth, isAdmin } = require("../middleware/verifyToken");
const { AssetsValidation } = require("../utils/AssetsValidation");
const User = require("../model/User");

//create an asset
route.post("/assets/create", Auth, isAdmin, async (req, res) => {
  resp = {};
  //validating incoming data
  const { error } = AssetsValidation(req.body);

  //check if there's an error in any of the assets fields
  if (error) {
    resp["status"] = "06";
    resp["message"] = error.message;

    return res.status(400).send(resp);
  } else {
    //const find = await User.findById(req.body.user);
    const asset = new Assets({
      name: req.body.name,
      typeofasset: req.body.typeofasset,
      description: req.body.description,
      user: req.body.user,
    });


    //Save assets in database
    try {
      const createdAsset = await asset.save();
    //   console.log(createdAsset);
      await UserAssetUpdate(req.body.user,createdAsset._id)
     
        resp["status"] = "01";
        resp["message"] = "Asset Successfully Created !";
        resp["data"] = createdAsset;
        return res.status(201).send(resp);
      
      
    } catch (error) {
        console.log(error);
      return res.status(500).send(error);
    }
  }
});

//delete an asset
route.delete("/delete/:assetId",Auth, isAdmin, async (req, res) => {
  resp = {};
  try {
    //check if asset exist
    const asset = await Assets.findById(req.params.assetId);

    //
    if (!asset) {
      resp["status"] = "06";
      resp["message"] = "Asset Not Found ! It might Probably be Deleted";

      return res.status(200).send(resp);
    }
    
    //check if asset has been assigned a user
        if(asset.user)
        {
            const userObject = await User.findById(asset.user); 

            let newAssetArray = []
           newAssetArray= userObject.assets.filter((el) =>{
                
               if(el._id.toString() !== req.params.assetId)
               {
                   return el;
               }
           })
   
             const updatedUser= await User.updateOne({_id:userObject._id},
            {$set: {assets:newAssetArray}})
           
            //comparing asset id with the one from client side
            const deleteAsset = await Assets.deleteOne({ _id: req.params.assetId });
        
    resp["status"] = "01";
    resp["message"] = "Assigned Asset Successfully Deleted";   
    return res.status(200).send(resp);
     }

     else
     {
        const deleteAsset = await Assets.deleteOne({ _id: req.params.assetId });
        resp["status"] = "01";
        resp["message"] = "Unassigned Asset Successfully Deleted";   
        return res.status(200).send(resp);

     }

  } catch (error) {
    resp["status"] = "06";
    resp["message"] = `Asset Couldn't Be Deleted`;
    resp["error"] = error;
    console.log("Error",error);
    return res.status(400).send(resp);
  }
});

//read an asset
route.get("/assets", Auth, isAdmin, async (req, res) => {
  resp = {};
  try {
       //check if there are users in the account
  const check = await Assets.find();
  if(check.length === 0)
  {
    resp['status'] = '06';
    resp['message'] = "Your asset collection is empty. Kindly create an asset";
    return res.status(404).send(resp);

  }
    const readall = await Assets.find();
    resp["status"] = "01";
    resp["message"] = "Assets Successfully Retrieved";
    resp["data"] = readall;

    return res.send(resp);
  } catch (error) {
    resp["status"] = "06";
    resp["message"] = `Asset Couldn't Be Read`;
    resp["error"] = error;

    return res.json(resp);
  }
});

//Get a specific Asset
route.get("/assets/:assetId", Auth, isAdmin, async (req, res) => {
  resp = {};
  try {
    const asset = await Assets.findById(req.params.assetId);

    if (!asset) {
      resp["status"] = "06";
      resp["message"] = "Asset Not Found ! It Might Probably be Deleted";

      return res.send(resp);
    } else {
      resp["status"] = "01";
      resp["message"] = `Asset Retrieved Successfully`;
      resp["data"] = asset;
      return res.send(resp);
    }
  } catch (error) {
    return res.send(error);
  }
});

//Update An Asset
route.patch("/assets/:assetId", Auth, isAdmin, async (req, res) => {
  resp = {};

  try {
    //check if asset exist
    const asset = await Assets.findById(req.params.assetId);

    if (!asset) {
      resp["status"] = "06";
      resp["message"] = "Asset Not Found ! It might Probably be Deleted";

      return res.send(resp);
    }

    // we check for id and update it.
    const updateAsset = await Assets.updateOne(
      { _id: req.params.assetId },
      {
        $set: {
          name: req.body.name,
          typeofasset: req.body.typeofasset,
          description: req.body.description,
        },
      }
    );

    resp["status"] = "01";
    resp["message"] = `Asset Updated Successfully`;
    resp['data']=updateAsset;
    return res.send(resp);

  } catch (error) {
    resp["status"] = "06";
    resp["message"] = `Unable to Update Asset`;
    resp["error"] = error;
    return res.send(resp);
  }
});

route.get("/getStats", Auth, isAdmin, async (req, res) => {
  resp = {};
  let assigned=0;
  let unassigned=0;

  try {
    
  const totalAssets = await Assets.find();
  totalAssets.map((i)=>{
    if(i.user)  assigned++ ;
    else  unassigned++;
  }); 
  resp['status']="01";
  resp['message']= "Stats Successfully Retrieved";
  resp['Assigned']=assigned;
  resp['Unassigned']=unassigned;
  resp['Total Assets']= totalAssets.length;
   
  return res.send(resp);
 
  } 
  catch
   (error) {
         console.log(error);
  }

});

//get all users
route.get("/users", Auth, isAdmin, async (req, res) => {
  resp = {};
  try {
    //check if there are users in the account
  const check = await User.find();
  if(check.length === 0)
  {
    resp['status'] = '06';
    resp['message'] = "Your user collection is empty. Kindly signup an account";
    return res.status(404).send(resp);

  }

    const getUser = await User.find().select("-password"); //the select helps remove password
    resp["status"] = "01";
    resp["message"] = "Users Successfully Retrieved";
    resp["data"] = getUser;

    return res.send(resp);
  } catch (error) {
    resp["status"] = "06";
    resp["message"] = `Users Couldn't Be Read`;
    resp["error"] = error;

    return res.json(resp);
  }
});

//Assign A user an asset
route.patch("/assign/:assetId", Auth, isAdmin, async (req, res) => {
  resp = {};

    try {
       await UserAssetUpdate(req.body.user,req.params.assetId);
    
        const assignAsset = await Assets.updateOne(
            { _id: req.params.assetId },
            {
              $set: {
                user: req.body.user,
              },
            }
          );
          resp["status"] = "01";
          resp["message"] = `Asset Assigned Successfully`;
          resp["data"] = assignAsset;
          return res.send(resp);
    } 
    catch (error) 
    {
        return res.send(error);
    }
});

route.get("/view-assigned-assets/:userId", Auth,isAdmin, async (req, res) => {

    resp = {};
    try {
      const readAssigned = await User.findById(req.params.userId);
    resp["status"] = "01";
    resp["message"] = "Assigned Assets Successfully Retrieved";
    resp["data"] = readAssigned.assets;

    //check if data is empty
    if(resp['data']==false)
    {
        console.log("Empty");
        resp["status"] = "06";
        resp["message"] = "User hasn't been assigned an asset";
        return res.send(resp);

    }

    return res.send(resp);

    } catch (error) {
      
  
    //   return res.json(resp);
    }
  });
route.post("/requestAsset",Auth,async(req,res)=>{
    resp={}

    
    try{
        
        const findAssets = await Assets.find();
  
        //return one unassigned asset at a time and assign.
        const assigningAsset = findAssets.find((el)=> !el.user)
       
        if(assigningAsset)
        {
         
        const updatedUser=await UserAssetUpdate(req.user._id,assigningAsset._id);
        resp["status"] = "01";
        resp["message"] = `Request Granted: Assets Successfully Assigned`;
        resp["data"] = updatedUser;
        return res.send(resp);

        }

      return res.send(" Request Denied : No Assets Available");
    }
    catch(error)
    {
        console.log(error)
        return res.send(error);
    }
    

})

//message issue
route.post("/assetIssue",Auth,async(req,res)=>{
  resp={};
    //we first get the id for the asset the issue is about
    //we get the id of the user sending the issue
    console.log(req.user);
    if(!req.body.userId ||!req.body.assetId || !req.body.message)
    {
        resp["status"] = "06";
        resp["error"] = `${!req.body.userId && "userId"} ${!req.body.assetId && "assetId"}  ${!req.body.message && "message"} is not available` ;
      
        return res.send(resp)
    }

    //1.check if message is available
    // if(req.body.message)
    await Assets.findOneAndUpdate({_id:req.body.assetId},{$set:{issues:req.body.message}});
    await User.findByIdAndUpdate({_id:req.body.userId},{$set:{messages:req.body.message}});
    await UserAssetUpdate(req.body.userId,req.body.assetId);
     
    resp["status"] = "01";
    resp["message"] = "Issue Sent to Admin";

    return res.send(resp);
    
})

//Alternative approach
const UserAssetUpdate = async(userId,assetId)=>{
resp={};
    // console.log("userId: "+userId+"   assetId :" +assetId)
    //check for userId
    if (userId)
    {
       const user = await User.findById(userId);
       const assetExist = user.assets.find((el) =>el._id === assetId);
       
       if (!assetExist) {
        const assetObject = await Assets.findById(assetId);
        
        const updatedUser =  await User.updateOne(
           { _id:user._id },
           {
             $set: {
               assets: [...user.assets,assetObject],
             },
           }
         );
         return updatedUser;
       }
       else
       {
        resp["status"] = "06";
        resp["message"] = `User Already Assigned This Asset `;
         
        return resp;

       }
     
}
}
module.exports = route;
