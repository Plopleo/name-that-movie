import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';
import dotenv from 'dotenv';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGO_URI;

async function importReviews() {
    try {
        console.log('Starting import process...');
        console.log(`Connecting to MongoDB at ${MONGODB_URI}`);

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected to MongoDB');

        // Get all CSV files from the data directory
        const dataDir = path.join(process.cwd(), 'data');
        console.log(`Reading CSV files from ${dataDir}`);

        const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.csv'));
        console.log(`Found ${files.length} CSV files to process`);

        let totalMovies = 0;
        let totalReviews = 0;

        for (const file of files) {
            console.log(`\nProcessing ${file}...`);
            const filePath = path.join(dataDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            // Parse CSV content
            console.log('Parsing CSV content...');
            const records = parse(content, {
                columns: true,
                skip_empty_lines: true
            });
            console.log(`Found ${records.length} records in ${file}`);

            // Process each record
            for (const record of records) {
                try {
                    if (!record.Name || !record.year) {
                        console.warn('Skipping record with missing title or year');
                        continue;
                    }

                    // Create or update movie
                    const movieData = {
                        title: record.Name,
                        year: parseInt(record.year),
                        director: record.director,
                        plot: record.description,
                        poster: record['image-src'],
                        url: record['Movie page-href']
                    };

                    let movie = await Movie.findOne({
                        title: movieData.title,
                        year: movieData.year
                    });

                    if (!movie) {
                        movie = await Movie.create(movieData);
                        console.log(`Created movie: ${movie.title} (${movie.year})`);
                        totalMovies++;
                    }

                    // Create review if it exists
                    if (record.reviews && record.reviews.trim()) {
                        await Review.create({
                            movie: movie._id,
                            comment: record.reviews
                        });
                        totalReviews++;
                    }
                } catch (error) {
                    console.error(`Error processing record:`, error);
                    console.error('Problematic record:', JSON.stringify(record, null, 2));
                }
            }
        }

        console.log('\nImport completed successfully!');
        console.log(`Total movies created: ${totalMovies}`);
        console.log(`Total reviews created: ${totalReviews}`);
    } catch (error) {
        console.error('\nFatal error during import:', error);
    } finally {
        try {
            await mongoose.disconnect();
            console.log('\nDisconnected from MongoDB');
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
        }
    }
}

// Run the import
console.log('Starting the import script...');
importReviews(); 