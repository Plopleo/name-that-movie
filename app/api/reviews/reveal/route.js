import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Review from '@/models/Review';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const reviewId = searchParams.get('reviewId');

        if (!reviewId) {
            return NextResponse.json(
                { error: 'Review ID is required' },
                { status: 400 }
            );
        }

        await connectMongo();
        const review = await Review.findById(reviewId).populate('movie');

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            movie: review.movie
        });
    } catch (error) {
        console.error('Error revealing movie:', error);
        return NextResponse.json(
            { error: 'Failed to reveal movie' },
            { status: 500 }
        );
    }
} 