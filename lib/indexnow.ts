/**
 * Submits URLs to IndexNow (Bing, Yandex, etc.) for instant indexing.
 * @param urls Array of absolute URLs to submit
 */
export async function submitToIndexNow(urls: string[]) {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
        console.log('[IndexNow] Skipping submission in development:', urls);
        return;
    }

    const host = 'grapeyear.com'; // Replace with actual domain from env if needed
    const key = '753d2b2ffa8c48f0851642ed4b4902be'; // Must match public/[key].txt
    const keyLocation = `https://${host}/${key}.txt`;

    try {
        const payload = {
            host,
            key,
            keyLocation,
            urlList: urls
        };

        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log('[IndexNow] Successfully submitted URLs:', urls.length);
        } else {
            console.error('[IndexNow] Submission failed:', response.status, await response.text());
        }
    } catch (error) {
        console.error('[IndexNow] Error submitting URLs:', error);
    }
}
