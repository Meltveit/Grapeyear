
'use client';

import { useEffect, useRef } from 'react';

interface EzoicPlaceholderProps {
    id: number;
}

export default function EzoicPlaceholder({ id }: EzoicPlaceholderProps) {
    const isDefined = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.ezstandalone) {
            if (!isDefined.current) {
                try {
                    // Define the placeholder
                    window.ezstandalone.cmd.push(function () {
                        window.ezstandalone?.define(id);
                        window.ezstandalone?.showAds(id);
                    });
                    isDefined.current = true;
                } catch (e) {
                    console.error(`Ezoic Placeholder ${id} Error:`, e);
                }
            }
        }
    }, [id]);

    return (
        <div className="w-full flex justify-center my-8">
            <div id={`ezoic-pub-ad-placeholder-${id}`}></div>
        </div>
    );
}
