const express = require("express"); // importing express function
const mongoose = require("mongoose"); // importing mongoose database
const dotenv = require('dotenv'); // importing dotenv for security reasons(protection)
const cors = require('cors')
//import routes
const authRoutes = require("./routesControllers/UserAuth");
const assetroute = require("./routesControllers/AssetsRouteController");


//invoke function
const app = express();
dotenv.config();


//connect to db
mongoose.connect(process.env.DB_CONNECT,).then(() => {
     console.log("Connected to db!");
  }).catch((error) => {
    console.log(`Unable to Connect to db!...( `+error+" )");
  });

app.use(cors());
app.use(express.json());//body parser

//routes middleware for urls
app.use("/api/user",authRoutes);
app.use("/api",assetroute);

//start server
app.listen(process.env.PORT, () => {
  console.log("Server Up And Running on port "+process.env.PORT);
});
