import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    title: { type: String, required: true, trim: true },
    notes: { type: String, default: '' },
    type: { type: String, enum: ['task', 'assignment', 'exam', 'quiz'], default: 'task' },
    priority: { type: Number, min: 1, max: 3, default: 2 },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    dueAt: { type: Date, default: null },
    weight: { type: Number, min: 0, max: 100 },
    score: { type: Number, min: 0, max: 100 },
    completedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, dueAt: 1 });
taskSchema.index({ user: 1, course: 1, status: 1 });

export default mongoose.model('Task', taskSchema);