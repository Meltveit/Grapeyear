import { MetadataRoute } from 'next';
import { TOP_REGIONS, YEARS_TO_FETCH } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.grapeyear.com';

    // 1. Static Routes
    const routes = [
        '',
        '/grapes',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // 2. Dynamic Country Routes
    const uniqueCountries = [...new Set(TOP_REGIONS.map(r => r.country.toLowerCase()))];
    const countryRoutes = uniqueCountries.map(country => ({
        url: `${baseUrl}/vintages/${country}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 3. Dynamic Vintage Routes
    // This generates URLs for every Region + Year combination we support
    let vintageRoutes: MetadataRoute.Sitemap = [];

    TOP_REGIONS.forEach((region) => {
        const regionUrls = YEARS_TO_FETCH.map((year) => ({
            url: `${baseUrl}/vintages/${region.countryCode.toLowerCase()}/${region.slug}/${year}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
        vintageRoutes = [...vintageRoutes, ...regionUrls];
    });

    return [...routes, ...countryRoutes, ...vintageRoutes];
}
