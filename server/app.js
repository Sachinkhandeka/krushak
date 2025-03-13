const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const { getMetadataForRoute } = require("./utils/seo.js");
const ApiError = require("./utils/apiError.js");

// Import Routes
const userRouter = require("./routes/user.routes.js");
const equipmentRouter = require("./routes/equipment.routes.js");
const bookingRoutes = require("./routes/booking.route.js");
const sitemapRoutes = require("./routes/sitemap.routes");

const app = express();

app.use(compression());

//  CORS Configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN.split(","), 
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"], 
    })
);

//  Middleware for JSON & Cookies
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());
app.use(express.static("public"));

//  Serve Static React Files
app.use(express.static(path.join(__dirname, "../client/dist"), {
    maxAge: "1y",
    etag: false
}));

// API Routes
app.use("/", sitemapRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/equipment", equipmentRouter);
app.use("/api/v1/bookings", bookingRoutes);

//  Server-Side Rendering (SSR) with SEO
app.get("*", (req, res, next) => {
    const indexFile = path.join(__dirname, "../client/dist", "index.html");

    fs.readFile(indexFile, "utf8", (err, html) => {
        if (err) {
            return next(new ApiError(500, "Internal Server Error"));
        }

        // Get dynamic SEO metadata based on route
        const metadata = getMetadataForRoute(req.originalUrl);

        // Ensure meta tags exist before replacing
        let finalHtml = html;

        if (metadata.title) {
            finalHtml = finalHtml.replace(/<title>.*<\/title>/, `<title>${metadata.title}</title>`);
        }
        if (metadata.description) {
            finalHtml = finalHtml.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${metadata.description}">`);
        }
        if (metadata.logo) {
            finalHtml = finalHtml.replace(/<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${metadata.logo}">`);
        }
        if (metadata.url) {
            finalHtml = finalHtml.replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="${metadata.url}${req.originalUrl}">`);
        }

        res.send(finalHtml);
    });
});

//  Global Error Handling Middleware
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success || false,
            message: err.message,
            errors: err.errors || [],
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }

    res.status(500).json({
        success: false,
        message: "Something went wrong!",
    });
});

module.exports = app;
