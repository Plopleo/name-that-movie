import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

// Vercel Cron configuration
export const config = {
    runtime: 'edge',
    maxDuration: 60,
};

export async function GET(request) {
    // Verify the cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let imageBuffer;
    try {
        // 1. Generate the image
        const imageResponse = await fetch(`https://name-that-movie.leopold.dev/api/social-image`);
        if (!imageResponse.ok) {
            throw new Error(`Failed to generate image: ${imageResponse.statusText} , ${imageResponse.status}`);
        }
        imageBuffer = await imageResponse.arrayBuffer();
    } catch (error) {
        console.error('Error generating social image:', error);
        return NextResponse.json(
            { error: 'Failed to generate social image' },
            { status: 500 }
        );
    }

    let client;
    try {
        // 2. Initialize Twitter client
        client = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_SECRET,
        });
    } catch (error) {
        console.error('Error initializing Twitter client:', error);
        return NextResponse.json(
            { error: 'Failed to initialize Twitter client' },
            { status: 500 }
        );
    }

    let mediaId;
    try {
        // 3. Upload the image to Twitter
        mediaId = await client.v1.uploadMedia(Buffer.from(imageBuffer), {
            mimeType: 'image/png',
        });
    } catch (error) {
        console.error('Error uploading media to Twitter:', error);
        return NextResponse.json(
            { error: 'Failed to upload media to Twitter' },
            { status: 500 }
        );
    }

    try {
        // 4. Create the tweet
        const tweet = await client.v2.tweet({
            text: '🎬 Can you guess this movie?\n\nPlay the gameand test your film knowledge! 🎯\n\nTry it here ▶️https://name-that-movie.leopold.dev \n\n#MovieQuiz #GuessTheMovie',
            media: { media_ids: [mediaId] },
        });

        return NextResponse.json({
            success: true,
            tweetId: tweet.data.id,
        });
    } catch (error) {
        console.error('Error creating tweet:', error);
        return NextResponse.json(
            { error: 'Failed to create tweet' },
            { status: 500 }
        );
    }
} 