export function CardReview({ review }) {
    const parts = review.split("[SPOILER]");
    const processedReview = parts.map((part, index) => {
        if (index === 0) return part;
        return (
            <>
                <span className="text-primary">[SPOILER]</span>
                {part}
            </>
        );
    });

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="prose max-w-none">
                    <blockquote className="text-lg italic">
                        &quot;{processedReview}&quot;
                    </blockquote>
                </div>
            </div>
        </div>
    );
} 