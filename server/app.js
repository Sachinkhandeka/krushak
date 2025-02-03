const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const ApiError = require("./utils/apiError.js");


const app = express();

//usefull middlewares
app.use(cors({
    origin : process.env.CORS_ORIGIN
}));
app.use(express.json({ limit : "100kb" }));
app.use(express.urlencoded({ extended : true, limit : "100kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.get("/", (req, res)=> {
    res.send("Express App setUp successfully.");
});

// static folder for client side pages
app.use(express.static((path.join( __dirname, "../client/dist" ))));

// routes that does not match with any routes will be handled here
app.use( "*", (req , res)=> {
    res.sendFile(path.join( __dirname, "../client/dist", "index.html" ));
});


// error handling middleware
app.use((err, req, res, next)=> {
    if( err instanceof ApiError ) {
        res.status(err.statusCode).json({
            success : err.success || false,
            message : err.message,
            errors : err.errors || [],
            stack : process.env.NODE_ENV === 'development' ? err.stack : undefined ,
        });
    }
    res.status(500).json({
        success : false,
        message : "Internal Server Error!"
    });
});

module.exports = app ; 