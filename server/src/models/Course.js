import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    semester: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    title: { type: String, required: true, trim: true },
    credits: { type: Number, min: 0, max: 30 },
    color: { type: String, default: '#6366f1' },
  },
  { timestamps: true }
);

courseSchema.index({ user: 1, semester: 1 });

export default mongoose.model('Course', courseSchema);