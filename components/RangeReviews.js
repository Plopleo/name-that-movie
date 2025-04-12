'use client'

export default function RangeReviews({ numReviews, setNumReviews }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <span>{numReviews} {numReviews === 1 ? 'review' : 'reviews'}</span>
            <input
                type="range"
                min="1"
                max="5"
                value={numReviews}
                onChange={(e) => setNumReviews(parseInt(e.target.value))}
                className="range range-xs range-primary"
            />
        </div>
    )
} 