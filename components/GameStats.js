export default function GameStats({ score, attempts }) {
    const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0

    return (
        <div className="stats shadow w-full max-w-xs">
            <div className="stat">
                <div className="stat-title">Score</div>
                <div className="stat-value text-primary">{score}</div>
            </div>

            <div className="stat">
                <div className="stat-title">Attempts</div>
                <div className="stat-value">{attempts}</div>
            </div>

            <div className="stat">
                <div className="stat-title">Accuracy</div>
                <div className="stat-value">{accuracy}%</div>
            </div>
        </div>
    )
} 