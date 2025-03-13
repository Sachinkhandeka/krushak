// server/utils/seo.js

const siteMetadata = {
    title: "Krushak - Farm Equipment Rental Platform",
    description: "Find and rent the best farm equipment hassle-free. Browse listings, connect with owners, and book machinery easily.",
    url: "https://krushak.co.in",
    logo: "https://res.cloudinary.com/dg840otuv/image/upload/v1741839605/krushak_logo_zllvhe.png",
};

const getMetadataForRoute = (urlPath) => {
    let metadata = { ...siteMetadata };

    if (urlPath.includes("/equipment/")) {
        metadata.title = "Rent High-Quality Farm Equipment | Krushak";
        metadata.description = "Browse and rent farm equipment with ease on Krushak.";
    } else if (urlPath.includes("/profile/")) {
        metadata.title = "User Profile | Krushak";
        metadata.description = "View user details and their farm equipment listings.";
    } else if (urlPath.includes("/booking/")) {
        metadata.title = "Manage Your Equipment Bookings | Krushak";
        metadata.description = "Easily manage your farm equipment bookings.";
    }

    return metadata;
};

module.exports = { getMetadataForRoute };
