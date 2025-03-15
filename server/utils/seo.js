// server/utils/seo.js

const siteMetadata = {
    title: "Krushak - Rent Farm Equipment Easily | Gujarat's No.1 Rental Platform",
    description: "Krushak is a farm equipment rental platform helping farmers book nearby harvesters, tractors, and farming tools hassle-free. Search on a live map and connect with equipment owners in Gujarat.",
    url: "https://krushak.co.in",
    logo: "https://res.cloudinary.com/dg840otuv/image/upload/v1741839605/krushak_logo_zllvhe.png",
    keywords: "Krushak, farm equipment rental, rent tractor, harvester rental, book farm tools, farm machinery hire, Krushak Gujarat, rent farming equipment, Krushak booking, Krushak farm, Krushak platform, book plow, Rapar tractor hire, Gujarat agriculture tools"
};

const getMetadataForRoute = (urlPath) => {
    let metadata = { ...siteMetadata };

    if (urlPath.includes("/equipment/")) {
        metadata.title = "Rent High-Quality Farm Equipment Near You | Krushak";
        metadata.description = "Find and rent the best farm machinery like tractors, harvesters, plows, and more. Search nearby farm tools and book easily on Krushak.";
        metadata.keywords += "ખેત ઉકરુપ ઉપકરણ ભાડે, ટ્રેક્ટર ભાડે, ખેડૂત મશીન ભાડે, ખેડૂત સાધનો, કૃષિ સાધન ભાડે, krushak app, rent farm equipment, tractor rental, harvester booking, book farm machinery, farm equipment near me, Gujarat farm rental, Krushak farm, agriculture equipment hire, Kutch farming tools, Rapar tractor booking, best farm equipment, Krushak booking, plow rental, farming tools hire, Krushak Gujarat, farm equipment marketplace, Krushak platform, agricultural tools rental";
    } else if (urlPath.includes("/profile/")) {
        metadata.title = "User Profile | View Listings & Equipment Details | Krushak";
        metadata.description = "Check user details, view their farm equipment listings, and connect with owners for easy rental in Gujarat.";
        metadata.keywords += ", user profile, farm equipment owner, Krushak profile, rental history, farmer tools listing";
    } else if (urlPath.includes("/booking/")) {
        metadata.title = "Manage Your Equipment Bookings | Krushak Rental";
        metadata.description = "Easily manage your farm equipment bookings, view rental history, and connect with equipment owners.";
        metadata.keywords += ", booking history, manage rentals, rent farming tools, tractor hire Gujarat, Krushak bookings";
    } else if (urlPath === "/" || urlPath.includes("?queries")) {
        metadata.title = "Find Nearby Farm Equipment for Rent | Live Map Search | Krushak";
        metadata.description = "Use Krushak's live map search to find farm equipment near you. Browse harvesters, tractors, and farming tools with location-based results.";
        metadata.keywords += ", search farm tools, nearby rental, tractor search, Krushak map search, rent plow Gujarat, farm equipment near me, agricultural machinery search";
    }

    return metadata;
};

module.exports = { getMetadataForRoute };
