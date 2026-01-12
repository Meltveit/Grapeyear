
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Declaration for Ezoic global object
declare global {
    interface Window {
        ezstandalone?: {
            cmd: any[];
            showAds: (ids?: number[]) => void;
            hasPlaceholder: (id: number) => boolean;
            define: (...ids: number[]) => void;
        };
    }
}

export default function EzoicGlobalHandler() {
    const pathname = usePathname();

    useEffect(() => {
        // Ensure Ezoic is loaded
        if (typeof window !== 'undefined' && window.ezstandalone) {
            try {
                console.log('Ezoic: Refreshing Ads for path', pathname);
                window.ezstandalone.cmd.push(function () {
                    // This triggers a refresh of all defined placeholders
                    window.ezstandalone?.showAds();
                });
            } catch (e) {
                console.error('Ezoic Error:', e);
            }
        }
    }, [pathname]);

    return null; // Component does not render anything
}
