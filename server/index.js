if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const app = require("./app.js");
const port = process.env.PORT || 8080 ; 

const connectToDatabase = require("./config/database");

connectToDatabase().then(()=> {
    app.listen(port, ()=> {
        console.log(`Server listening to port ${port}`);
    });
}).catch((error)=> {
    console.log("MongoDB connection failed!", error);
})