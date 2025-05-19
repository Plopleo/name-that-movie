'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestSocialPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Check if we're in development environment
        if (process.env.NODE_ENV !== 'development') {
            router.push('/'); // Redirect to home page in production
        }
    }, [router]);

    // If not in development, don't render anything
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    const handleTest = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/test-social-post');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to post to social media');
            }

            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Test Social Post</h1>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Test Twitter Post</h2>
                        <p className="mb-4">
                            Click the button below to test the social post functionality.
                            This will generate an image and post it to Twitter.
                        </p>

                        <div className="card-actions justify-end">
                            <button
                                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                                onClick={handleTest}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Testing...' : 'Test Social Post'}
                            </button>
                        </div>

                        {error && (
                            <div className="alert alert-error mt-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {result && (
                            <div className="alert alert-success mt-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-bold">Success!</h3>
                                    <div className="text-xs">
                                        Tweet ID: {result.tweetId}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 