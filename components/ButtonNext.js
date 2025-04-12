'use client'

export default function ButtonNext({ onClick, isLoading }) {
    return (
        <button
            onClick={onClick}
            className="btn btn-outline btn-primary"
            disabled={isLoading}
        >
            {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
            ) : (
                'Next Movie'
            )}
        </button>
    );
} 