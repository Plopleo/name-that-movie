import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review; 