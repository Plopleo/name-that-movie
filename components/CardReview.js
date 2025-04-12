export function CardReview({ review }) {
    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="prose max-w-none">
                    <blockquote className="text-lg italic">
                        &quot;{review}&quot;
                    </blockquote>
                </div>
            </div>
        </div>
    )
} 