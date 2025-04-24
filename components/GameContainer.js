'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { CardReview } from './CardReview'
import { InputGuess } from './InputGuess'
import { CardMovieDetails } from './CardMovieDetails'
import ButtonNext from './ButtonNext'

// Dynamically import confetti to avoid SSR issues
const Confetti = dynamic(() => import('react-confetti'), {
    ssr: false
});

export default function GameContainer({
    setScore,
    setAttempts,
    numReviews,
    selectedDecades,
    setGuessHistory,
    showYear,
    showDirector
}) {
    const [reviews, setReviews] = useState([])
    const [currentMovie, setCurrentMovie] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [correctMovie, setCorrectMovie] = useState(null)
    const [showConfetti, setShowConfetti] = useState(false)
    const [wrongGuesses, setWrongGuesses] = useState(0)
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    })
    const isDebugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'

    const fetchNewReviews = useCallback(async () => {
        try {
            setIsLoading(true)
            setShowConfetti(false)
            setWrongGuesses(0)
            setGuessHistory([])
            const { data } = await axios.get(`/api/reviews/random?count=${numReviews}&decades=${selectedDecades.join(',')}`)
            setReviews(data.reviews)
            setCurrentMovie(data.movie)
            setCorrectMovie(null)
            setError(null)
        } catch (err) {
            setError('Failed to fetch reviews. Please try again.')
            console.error('Error fetching reviews:', err)
        } finally {
            setIsLoading(false)
        }
    }, [numReviews, selectedDecades, setGuessHistory])

    useEffect(() => {
        if (selectedDecades.length > 0) {
            fetchNewReviews()
        }
    }, [fetchNewReviews, selectedDecades])

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    async function handleGuess(guess) {
        try {
            setIsSubmitting(true)
            setAttempts(prev => prev + 1)

            const { data } = await axios.post('/api/guess', {
                reviewId: reviews[0]._id,
                guess: guess
            })

            setGuessHistory(prev => [...prev, {
                text: guess,
                similarity: data.similarity
            }])

            if (data.isCorrect) {
                setScore(prev => prev + 1)
                setCorrectMovie(data.movie)
                setShowConfetti(true)
            } else {
                setWrongGuesses(prev => prev + 1)
            }
        } catch (err) {
            setError('Failed to validate guess. Please try again.')
            console.error('Error validating guess:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleReveal() {
        try {
            setIsSubmitting(true)
            const { data } = await axios.get(`/api/reviews/reveal?reviewId=${reviews[0]._id}`)
            setCorrectMovie(data.movie)
        } catch (err) {
            setError('Failed to reveal movie details. Please try again.')
            console.error('Error revealing movie:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
                <button className="btn btn-sm" onClick={fetchNewReviews}>Try Again</button>
            </div>
        )
    }

    if (correctMovie) {
        return (
            <div className="flex flex-col items-center gap-6">
                {showConfetti && (
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        recycle={false}
                        numberOfPieces={500}
                        gravity={0.3}
                    />
                )}
                <CardMovieDetails movie={correctMovie} />
                <ButtonNext onClick={fetchNewReviews} isLoading={isLoading} />
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center">
            {isLoading ? (
                <div className="flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <div className="flex flex-col w-full gap-4">
                    <div className="flex gap-4 justify-center">
                        {showYear && currentMovie?.year && (
                            <div className="text-center text-sm">
                                Year: <span className="text-primary">{currentMovie.year}</span>
                            </div>
                        )}
                        {showDirector && currentMovie?.director && (
                            <div className="text-center text-sm">
                                Director: <span className="text-primary">{currentMovie.director}</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                        {reviews.map((review) => (
                            <CardReview key={review._id} review={review.comment} />
                        ))}
                        {isDebugMode && currentMovie.title && (
                            <div className="text-center text-sm text-gray-500">
                                Debug: {currentMovie.title}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 w-full mt-4">
                        <div className="flex-1">
                            <InputGuess
                                onGuess={handleGuess}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                        <ButtonNext onClick={fetchNewReviews} isLoading={isLoading} />
                    </div>
                    {wrongGuesses >= 3 && (
                        <div className="flex justify-end">
                            <button
                                onClick={handleReveal}
                                className="btn btn-outline btn-error"
                            >
                                Reveal Movie ?
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
} 