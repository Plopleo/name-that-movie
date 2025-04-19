'use client'

import { useEffect, useState } from 'react'

export default function GuessHistory({ guesses }) {
    const [sortedGuesses, setSortedGuesses] = useState([])

    useEffect(() => {
        // Sort guesses by similarity score in descending order
        const sorted = [...guesses].sort((a, b) => b.similarity - a.similarity)
        setSortedGuesses(sorted)
    }, [guesses])

    if (guesses.length === 0) {
        return null
    }

    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-sm">Guess History</h3>
            <div className="space-y-1">
                {sortedGuesses.map((guess, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center text-sm bg-base-200 p-2 rounded"
                    >
                        <span className="truncate">{guess.text}</span>
                        <span className="text-primary font-medium">
                            {(guess.similarity * 100).toFixed(0)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
} 