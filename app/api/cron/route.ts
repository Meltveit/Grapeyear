import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { updateVintagesForRegions } from '@/lib/ingest';

export const maxDuration = 60; // Allow 60 seconds (Vercel max for Hobby)

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');

        // Secure execution: Check for Vercel Cron secret (automatically present in Vercel Cron jobs)
        // or a custom CRON_SECRET env var.
        if (
            process.env.CRON_SECRET &&
            authHeader !== `Bearer ${process.env.CRON_SECRET}`
        ) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const currentYear = new Date().getFullYear();
        // Update this year and last year to capture ongoing growing seasons
        const yearsToUpdate = [currentYear, currentYear - 1];

        console.log(`[Cron] Starting scheduled update for ${yearsToUpdate.join(', ')}...`);
        const stats = await updateVintagesForRegions(yearsToUpdate);

        return NextResponse.json({
            success: true,
            message: `Updated data for ${stats.updated} region-years. Errors: ${stats.errors}.`
        });

    } catch (error) {
        console.error('[Cron] Job failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
