import { NextResponse } from 'next/server';
import Review from '@/models/Review';
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
                'movie.year': {
                    $gte: startYear,
                    $lt: startYear + 10
                }
            }));
            matchStage.$or = yearRanges;
        }

        // Get random reviews with their associated movies
        const reviews = await Review.aggregate([
            {
                $lookup: {
                    from: 'movies',
                    localField: 'movie',
                    foreignField: '_id',
                    as: 'movie'
                }
            },
            { $unwind: '$movie' },
            { $match: matchStage },
            { $sample: { size: count } },
            {
                $project: {
                    _id: 1,
                    comment: 1,
                    movieId: '$movie._id',
                    movie: {
                        _id: '$movie._id',
                        title: '$movie.title',
                        year: '$movie.year'
                    }
                }
            }
        ]);

        if (!reviews.length) {
            return NextResponse.json(
                { error: 'No reviews found for the selected decades' },
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
                _id: reviews[0].movie._id,
                title: reviews[0].movie.title,
                year: reviews[0].movie.year
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