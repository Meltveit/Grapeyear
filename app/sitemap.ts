import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Region from '@/lib/models/Region';
import Winery from '@/lib/models/Winery';
import Vintage from '@/lib/models/Vintage';
import { TOP_REGIONS } from '@/lib/constants';

const BASE_URL = 'https://www.grapeyear.com';

export async function generateSitemaps() {
    return [
        { id: 'main' },
        { id: 'regions' },
        { id: 'wineries' },
        { id: 'vintages' },
    ];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
    // Ensure DB Connection
    await dbConnect();

    if (id === 'main') {
        const routes = [
            '',
            '/about',
            '/contact',
            '/privacy',
            '/vineyards',
            '/grapes',
            '/guides/making-wine', // Add other guides if dynamic or static list
        ].map((route) => ({
            url: `${BASE_URL}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        }));
        return routes;
    }

    if (id === 'regions') {
        // Fetch All Regions from DB
        const regions = await Region.find({}).select('slug country updatedAt').lean();

        // 1. Country Pages (Dynamic based on existing regions)
        const uniqueCountries = Array.from(new Set(regions.map((r: any) => r.country.toLowerCase().replace(/ /g, '-'))));
        const countryRoutes = uniqueCountries.map(country => ({
            url: `${BASE_URL}/vineyards/${country}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        // 2. Region Pages
        const regionRoutes = regions.map((region: any) => ({
            url: `${BASE_URL}/vineyards/${region.country.toLowerCase().replace(/ /g, '-')}/${region.slug}`,
            lastModified: region.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

        return [...countryRoutes, ...regionRoutes];
    }

    if (id === 'wineries') {
        const wineries = await Winery.find({}).select('slug updatedAt').lean();
        return wineries.map((winery: any) => ({
            url: `${BASE_URL}/wineries/${winery.slug}`,
            lastModified: winery.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    }

    if (id === 'vintages') {
        // Optimized: Fetch only necessary fields
        // Since we have ~2000-3000 rows, fetching all is fine for a build process or ISG.
        // We need region slug and country for URL construction.
        const vintages = await Vintage.find({})
            .select('year regionId updatedAt')
            .populate('regionId', 'slug country')
            .lean();

        return vintages
            .filter((v: any) => v.regionId) // Ensure region still exists
            .map((v: any) => ({
                url: `${BASE_URL}/vintages/${v.regionId.country.toLowerCase().replace(/ /g, '-')}/${v.regionId.slug}/${v.year}`,
                lastModified: v.updatedAt || new Date(),
                changeFrequency: 'yearly' as const,
                priority: 0.6,
            }));
    }

    return [];
}
