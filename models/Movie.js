import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
    required: true,
    trim: true,
  },
  plot: {
    type: String,
    required: true,
    trim: true,
  },
  poster: {
    type: String,
    trim: true,
  },
});

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

export default Movie; 