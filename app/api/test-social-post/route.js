import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function GET(request) {
    // Check if we're in development environment
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json(
            { error: 'This endpoint is only available in development environment' },
            { status: 403 }
        );
    }

    try {
        // Get the base URL from the request
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = request.headers.get('host');
        const baseUrl = `${protocol}://${host}`;

        // 1. Generate the image
        const imageResponse = await fetch(`${baseUrl}/api/social-image`);
        const imageBuffer = await imageResponse.arrayBuffer();

        // 2. Initialize Twitter client
        const client = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_SECRET,
        });

        // 3. Upload the image to Twitter
        const mediaId = await client.v1.uploadMedia(Buffer.from(imageBuffer), {
            mimeType: 'image/png',
        });

        // 4. Create the tweet
        const tweet = await client.v2.tweet({
            text: '🎬 Can you guess this movie?\n\nPlay Name That Movie and test your film knowledge! 🎯\n\nTry it here ▶️https://name-that-movie.leopold.dev \n\n#MovieQuiz #GuessTheMovie',
            media: { media_ids: [mediaId] },
        });

        return NextResponse.json({
            success: true,
            tweetId: tweet.data.id,
            message: 'Test tweet posted successfully!'
        });
    } catch (error) {
        console.error('Error in test social post:', error);
        console.error(error.data);
        return NextResponse.json(
            {
                error: 'Failed to post to social media',
                details: error.message
            },
            { status: 500 }
        );
    }
} 