const express = require("express");
const router = express.Router();
const sitemapController = require("../controllers/sitemap.controller");

router.get("/sitemap.xml", sitemapController.generateSitemap);

module.exports = router;
