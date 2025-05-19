import { ImageResponse } from '@vercel/og';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
    try {
        // Get the base URL from the request
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = request.headers.get('host');
        const baseUrl = `${protocol}://${host}`;

        // Use absolute URL
        const response = await fetch(`${baseUrl}/api/reviews/random?count=2`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.reviews?.length) {
            return NextResponse.json(
                { error: 'No reviews found' },
                { status: 404 }
            );
        }

        const [review1, review2] = data.reviews;

        // Load the logo image
        const logoResponse = await fetch(`${baseUrl}/img/logo.png`);
        if (!logoResponse.ok) {
            throw new Error(`Failed to fetch logo: ${logoResponse.status} ${logoResponse.statusText}`);
        }
        const logoImageData = await logoResponse.arrayBuffer();

        // Generate the image
        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1200px',
                        height: '630px',
                        backgroundColor: '#00111D',
                        color: 'white',
                        padding: '40px',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                backgroundClip: 'text',
                                color: '#BDFF00',
                            }}
                        >
                            Name That Movie!
                        </div>
                        <img
                            src={logoImageData}
                            alt="Logo"
                            width="160"
                            height="160"
                            style={{
                                objectFit: 'contain',
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            fontSize: '20px',
                            color: '#FFD6A7',
                        }}
                    >
                        Released in&nbsp;<span style={{ color: '#BDFF00' }}>{data.movie.year}</span>, Directed by&nbsp;<span style={{ color: '#BDFF00' }}>{data.movie.director}</span>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '20px',
                            marginTop: '60px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                textAlign: 'center',
                                maxWidth: '800px',
                                lineHeight: '1.4',
                                fontFamily: 'sans-serif',
                                padding: '20px',
                                borderRadius: '15px',
                                backgroundColor: '#001E29',
                                color: '#FFD6A7',
                                whiteSpace: 'pre-line',
                            }}
                        >
                            &ldquo;{truncateComment(review1.comment)}&rdquo;
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                textAlign: 'center',
                                maxWidth: '800px',
                                lineHeight: '1.4',
                                fontFamily: 'sans-serif',
                                padding: '20px',
                                borderRadius: '15px',
                                backgroundColor: '#001E29',
                                color: '#FFD6A7',
                                whiteSpace: 'pre-line',
                            }}
                        >
                            &ldquo;{truncateComment(review2.comment)}&rdquo;
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            bottom: '40px',
                            fontSize: '24px',
                            color: '#BDFF00',
                        }}
                    >
                        Can you guess this movie based on these reviews?
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (error) {
        console.error('Error generating social image:', error);
        return NextResponse.json(
            { error: 'Failed to generate social image' },
            { status: 500 }
        );
    }
}

function truncateComment(comment, maxLines = 4) {
    const words = comment.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        if ((currentLine + ' ' + word).length > 50) { // Approximate characters per line
            lines.push(currentLine.trim());
            currentLine = word;
        } else {
            currentLine += (currentLine ? ' ' : '') + word;
        }
    }

    if (currentLine) {
        lines.push(currentLine.trim());
    }

    if (lines.length > maxLines) {
        return lines.slice(0, maxLines).join('\n') + '...';
    }

    return lines.join('\n');
}