const Equipment = require("../models/equipment");
const User = require("../models/user");
const Booking = require("../models/booking");
const ApiError = require("../utils/apiError");

const baseURL = "https://krushak.co.in";

module.exports.generateSitemap = async (req, res) => {
    try {
        let urls = [];

        //  Fetch all equipment listings
        const equipments = await Equipment.find({}, "_id updatedAt");
        equipments.forEach((equipment) => {
            urls.push({
                loc: `${baseURL}/equipment/${equipment._id}`,
                lastmod: equipment.updatedAt.toISOString(),
                priority: 0.8
            });
        });

        // 👤 Fetch all user profiles (Public Profiles)
        const users = await User.find({}, "_id updatedAt");
        users.forEach((user) => {
            urls.push({
                loc: `${baseURL}/profile/${user._id}`,
                lastmod: user.updatedAt.toISOString(),
                priority: 0.6
            });
        });

        //  Fetch all bookings (For owners & users)
        const bookings = await Booking.find({}, "_id updatedAt");
        bookings.forEach((booking) => {
            urls.push({
                loc: `${baseURL}/booking/${booking._id}`,
                lastmod: booking.updatedAt.toISOString(),
                priority: 0.5
            });
        });

        //  Static Pages (Manually Added)
        const staticPages = [
            { loc: `${baseURL}/`, priority: 1.0 }, // Homepage
            { loc: `${baseURL}/about`, priority: 0.7 },
            { loc: `${baseURL}/contact`, priority: 0.7 },
        ];

        urls = [...urls, ...staticPages];

        //  Generate XML Sitemap Format
        let xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xmlSitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        urls.forEach(({ loc, lastmod, priority }) => {
            xmlSitemap += `  <url>\n`;
            xmlSitemap += `    <loc>${loc}</loc>\n`;
            if (lastmod) xmlSitemap += `    <lastmod>${lastmod}</lastmod>\n`;
            xmlSitemap += `    <priority>${priority}</priority>\n`;
            xmlSitemap += `  </url>\n`;
        });

        xmlSitemap += `</urlset>`;

        res.header("Content-Type", "application/xml");
        res.status(200).send(xmlSitemap);
    } catch (error) {
        throw new ApiError(500, "Error generating sitemap");
    }
};
