import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Review from '@/models/Review';
import stringSimilarity from 'string-similarity';

export async function POST(request) {
    try {
        const { reviewId, guess } = await request.json();

        if (!reviewId || !guess) {
            return NextResponse.json(
                { error: 'Review ID and guess are required' },
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

        const normalizeString = (str) => {
            return str
                .toLowerCase()
                .trim();
        };

        const normalizedGuess = normalizeString(guess);
        const normalizedTitle = normalizeString(review.movie.title);

        const similarity = stringSimilarity.compareTwoStrings(normalizedGuess, normalizedTitle);

        // Consider it correct if similarity is above 70%
        const isCorrect = similarity >= 0.70;

        return NextResponse.json({
            isCorrect,
            movie: isCorrect ? review.movie : null,
            similarity
        });
    } catch (error) {
        console.error('Error validating guess:', error);
        return NextResponse.json(
            { error: 'Failed to validate guess' },
            { status: 500 }
        );
    }
} 