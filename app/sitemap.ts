import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Region from '@/lib/models/Region';
import Winery from '@/lib/models/Winery';
import Vintage from '@/lib/models/Vintage';
import { TOP_REGIONS } from '@/lib/constants';

const BASE_URL = 'https://grapeyear.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes: MetadataRoute.Sitemap = [];

    // 1. MAIN STATIC ROUTES (No DB Needed)
    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/privacy',
        '/vineyards',
        '/grapes',
        '/guides/making-wine',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    routes.push(...staticRoutes);

    // 2. DYNAMIC ROUTES (Try DB)
    try {
        await dbConnect();

        // Regions
        const regions = await Region.find({}).select('slug country updatedAt').lean();
        if (regions && regions.length > 0) {
            const uniqueCountries = Array.from(new Set(regions.map((r: any) => r.country ? r.country.toLowerCase().replace(/ /g, '-') : 'unknown')));

            // Country Pages
            const countryRoutes = uniqueCountries.map(country => ({
                url: `${BASE_URL}/vineyards/${country}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));
            routes.push(...countryRoutes);

            // Region Pages
            const regionRoutes = regions.map((region: any) => ({
                url: `${BASE_URL}/vineyards/${region.country.toLowerCase().replace(/ /g, '-')}/${region.slug}`,
                lastModified: region.updatedAt || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.9,
            }));
            routes.push(...regionRoutes);
        }

        // Wineries
        const wineries = await Winery.find({}).select('slug updatedAt').lean();
        if (wineries && wineries.length > 0) {
            const wineryRoutes = wineries.map((winery: any) => ({
                url: `${BASE_URL}/wineries/${winery.slug}`,
                lastModified: winery.updatedAt || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));
            routes.push(...wineryRoutes);
        }

        // Vintages
        const vintages = await Vintage.find({})
            .select('year regionId updatedAt')
            .populate('regionId', 'slug country')
            .lean();

        if (vintages && vintages.length > 0) {
            const vintageRoutes = vintages
                .filter((v: any) => v.regionId && v.regionId.slug && v.regionId.country)
                .map((v: any) => ({
                    url: `${BASE_URL}/vintages/${v.regionId.country.toLowerCase().replace(/ /g, '-')}/${v.regionId.slug}/${v.year}`,
                    lastModified: v.updatedAt || new Date(),
                    changeFrequency: 'yearly' as const,
                    priority: 0.6,
                }));
            routes.push(...vintageRoutes);
        }

    } catch (error) {
        console.error("Sitemap DB Error:", error);
        // We continue and return at least the static routes
    }

    return routes;
}
