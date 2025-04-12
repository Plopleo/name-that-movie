import mongoose from "mongoose";
import Movie from "@/models/Movie";
import Review from "@/models/Review";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectMongo = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 60000, // 1 minute
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4, // Use IPv4, skip trying IPv6
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      w: 'majority',
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // Add connection error handler
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        // Reset cache if it's a fatal error
        if (err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkError') {
          console.error('Fatal MongoDB error - resetting connection cache');
          cached.promise = null;
          cached.conn = null;
        }
      });

      // Add disconnection handler
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected - attempting to reconnect...');
        cached.promise = null;
        cached.conn = null;
      });

      // Cleanup on app termination
      ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
        process.on(signal, async () => {
          try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
          } catch (err) {
            console.error('Error closing MongoDB connection:', err);
            process.exit(1);
          }
        });
      });

      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    // Reset cache on connection error
    cached.promise = null;
    cached.conn = null;
    console.error('MongoDB Connection Error:', e.message);
    // Throw a more descriptive error
    throw new Error(`Failed to connect to MongoDB: ${e.message}`);
  }
};

export default connectMongo;