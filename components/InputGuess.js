'use client'

import { useState } from 'react'

export function InputGuess({ onGuess, isSubmitting }) {
    const [guess, setGuess] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        if (guess.trim() && !isSubmitting) {
            onGuess(guess)
            setGuess('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
            <input
                type="text"
                placeholder="Enter movie title..."
                className="input input-bordered w-full"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                disabled={isSubmitting}
            />
            <button
                type="submit"
                className="btn btn-primary whitespace-nowrap"
                disabled={isSubmitting || !guess.trim()}
            >
                {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    'Guess'
                )}
            </button>
        </form>
    )
} 