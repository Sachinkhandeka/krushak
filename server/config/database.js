const mongoose = require("mongoose");
const database_URL = process.env.DATABASE_URL;

const connectToDatabase = async ()=> {
    try {
        await mongoose.connect(database_URL);
        console.log("Connection to database successful.");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectToDatabase ; 