import { NextResponse } from 'next/server';
import Review from '@/models/Review';
import Movie from '@/models/Movie';
import connectMongo from '@/lib/mongoose';

export async function GET(request) {
    try {
        await connectMongo();

        const { searchParams } = new URL(request.url);
        const count = parseInt(searchParams.get('count')) || 1;
        const decades = searchParams.get('decades')?.length > 0 ? searchParams.get('decades').split(',').map(Number) : [];

        // Build the query based on selected decades
        let matchStage = {};
        if (decades.length > 0) {
            const yearRanges = decades.map(startYear => ({
                year: {
                    $gte: startYear,
                    $lt: startYear + 10
                }
            }));
            matchStage.$or = yearRanges;
        }

        // First, get a random movie that has reviews
        const randomMovie = await Movie.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'movie',
                    as: 'reviews'
                }
            },
            { $match: { reviews: { $exists: true, $ne: [] } } },
            { $sample: { size: 1 } }
        ]);

        if (!randomMovie.length) {
            return NextResponse.json(
                { error: 'No movies with reviews found for the selected decades' },
                { status: 404 }
            );
        }

        const selectedMovie = randomMovie[0];

        // Then get random reviews for that movie
        const reviews = await Review.aggregate([
            { $match: { movie: selectedMovie._id } },
            { $sample: { size: count } },
            {
                $project: {
                    _id: 1,
                    comment: 1,
                    movieId: '$movie'
                }
            }
        ]);

        if (!reviews.length) {
            return NextResponse.json(
                { error: 'No reviews found for the selected movie' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            reviews: reviews.map(review => ({
                _id: review._id,
                comment: review.comment,
                movieId: review.movieId
            })),
            movie: {
                _id: selectedMovie._id,
                title: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' ? selectedMovie.title : null,
                year: selectedMovie.year,
                director: selectedMovie.director,
            }
        });
    } catch (error) {
        console.error('Error fetching random reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch random reviews' },
            { status: 500 }
        );
    }
} 