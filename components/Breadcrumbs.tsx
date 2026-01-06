import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    // Generate Schema.org JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1, // 1-based index including "Home" which we'll handle implicitly or explicitly? 
            // Better to let consumer pass full path or we prepend Home. 
            // Let's assume consumer passes everything AFTER Home, or we prepend Home here.
            // Let's prepend Home internally for consistency.
            name: item.label,
            item: item.href ? `https://grapeyear.com${item.href}` : undefined
        }))
    };

    // Prepend home to the list for rendering and schema
    const fullItems = [
        { label: 'Home', href: '/' },
        ...items
    ];

    // Re-generate schema with Home included
    const schemaItems = fullItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: item.href ? `https://grapeyear.com${item.href}` : undefined
    }));

    const finalJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: schemaItems
    };

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(finalJsonLd) }}
            />
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                {fullItems.map((item, index) => {
                    const isLast = index === fullItems.length - 1;

                    return (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-gray-600 mx-2" />
                            )}

                            {isLast ? (
                                <span className="text-white bg-white/10 px-2 py-0.5 rounded-md font-medium" aria-current="page">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href || '#'}
                                    className="hover:text-white transition-colors flex items-center gap-1"
                                >
                                    {index === 0 && <Home className="w-3 h-3 mb-0.5" />}
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
