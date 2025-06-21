const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = () => {
    // 9W@ybb-fuMLjDAW    // mongodb+srv://dbusr:9W@ybb-fuMLjDAW@chatapp.gjabb.mongodb.net/
    mongoose.connect("mongodb+srv://dbusr:Rajeev123@chatapp.gjabb.mongodb.net", {
        // useNewUrlParser:true,
        // useUnifiedTopology: true,
    })
    .then(() => console.log("DB ka Connection is Successful"))
    .catch( (error) => {
        console.log("Issue in DB Connection");
        console.error(error.message);
        //iska matlab kya h ?
        process.exit(1);
    } );
}

module.exports = dbConnect;