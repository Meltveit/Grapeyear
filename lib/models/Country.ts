import mongoose from 'mongoose';

const CountrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String, // e.g. "FR"
        required: true,
    },
    description: {
        type: String, // Rich text intro for the country page
    },
    imageUrl: {
        type: String,
    },
    // pSEO / SEO Template Fields
    seoTitleTemplate: {
        type: String,
        default: 'Best Vineyards & Wineries in {country} | Grapeyear',
    },
    metaDescTemplate: {
        type: String,
        default: 'Explore top wine regions in {country}. innovative wineries, and vintage reports. Discover the best of {country} wines.',
    },
    introTextTemplate: {
        type: String,
        // Example: "Home to world-class regions like {top_region_1} and {top_region_2}, {country} offers..."
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Country || mongoose.model('Country', CountrySchema);
