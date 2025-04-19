import Image from 'next/image';

export function CardMovieDetails({ movie }) {
    return (
        <div className="bg-black/90 text-gray-200 rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Movie Poster Section */}
                <div className="md:w-1/3 relative min-h-[500px] w-full flex items-center">
                    {/* Blurred Background */}
                    {movie.poster && (
                        <div className="absolute inset-0">
                            <Image
                                src={movie.poster}
                                alt=""
                                fill
                                className="object-cover blur-xl scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                            />
                            <div className="absolute inset-0 bg-black/70" />
                        </div>
                    )}

                    {/* Main Poster */}
                    <div className="relative w-full flex items-center justify-center p-4">
                        {movie.poster ? (
                            <div className="relative w-full aspect-[2/3]">
                                <Image
                                    src={movie.poster}
                                    alt={`${movie.title} poster`}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <span className="text-gray-500">No poster available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Movie Details Section */}
                <div className="flex-1 p-6 relative">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-wider">
                                <a href={movie.url} target="_blank" className="hover:underline hover:text-primary">
                                    {movie.title}
                                </a>
                                <span className="text-gray-400 ml-3">{movie.year}</span>
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                {movie.runtime && (
                                    <span className="flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                                        {movie.runtime}
                                    </span>
                                )}
                                {movie.genre && (
                                    <span className="flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                                        {movie.genre}
                                    </span>
                                )}
                                {movie.rating && (
                                    <span className="flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                                        {movie.rating}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">Directed by</span>
                                <span className="text-lg font-semibold">{movie.director}</span>
                            </div>

                            {movie.cast && (
                                <div className="space-y-2">
                                    <h3 className="text-gray-400">Cast</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.cast.split(',').map((actor, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-800/50 rounded-full text-sm"
                                            >
                                                {actor.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <h3 className="text-gray-400">Overview</h3>
                                <p className="text-gray-300 leading-relaxed">{movie.plot}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 