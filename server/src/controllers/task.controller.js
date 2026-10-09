import mongoose from 'mongoose';
import { z } from 'zod';
import Task from '../models/Task.js';
import Course from '../models/Course.js';

const taskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  notes: z.string().max(5000).optional(),
  course: z.string().nullable().optional(),
  type: z.enum(['task', 'assignment', 'exam', 'quiz']).optional(),
  priority: z.number().int().min(1).max(3).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  dueAt: z.coerce.date().nullable().optional(),
  weight: z.number().min(0).max(100).optional(),
  score: z.number().min(0).max(100).optional(),
});
const updateSchema = taskSchema.partial();
const startOfDay = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate());


async function ownsCourse(userId, courseId){
    if(!courseId) return true;
    if(!mongoose.isValidObjectId(courseId)) return false;
    return !!(await Course.exists({_id: courseId, user: userId}));

}

export async function listTasks(req,res){
      const { view, course, status } = req.query;
      const filter = { user: req.userId, deletedAt: null };

      const today = startOfDay();
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      if (view === 'today') {
      filter.dueAt = { $gte: today, $lt: tomorrow };
      filter.status = { $ne: 'done' };
      } else if (view === 'upcoming') {
      filter.dueAt = { $gte: tomorrow };
      filter.status = { $ne: 'done' };
      } else if (view === 'overdue') {
      filter.dueAt = { $lt: today };
      filter.status = { $ne: 'done' };
  }
      if (typeof course === 'string' && mongoose.isValidObjectId(course)) filter.course = course;
      if (typeof status === 'string' && ['todo', 'in_progress', 'done'].includes(status)) {
      filter.status = status;
  }
     const tasks = await Task.find(filter)
    .populate('course', 'code title color')
    .sort({ dueAt: 1, priority: -1 });
    res.json({ tasks });
}
export async function createTask(req, res) {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
  }
  if (!(await ownsCourse(req.userId, parsed.data.course))) {
    return res.status(400).json({ error: 'Invalid course' });
  }
  const data = { ...parsed.data, user: req.userId };
  if (data.status === 'done') data.completedAt = new Date();
  const task = await Task.create(data);
  await task.populate('course', 'code title color');
  res.status(201).json({ task });
}

export async function updateTask(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
  }
  if (!(await ownsCourse(req.userId, parsed.data.course))) {
    return res.status(400).json({ error: 'Invalid course' });
  }

  const changes = { ...parsed.data };
  if (changes.status === 'done') changes.completedAt = new Date();
  else if (changes.status) changes.completedAt = null;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId, deletedAt: null },
    changes,
    { returnDocument: 'after' }
  ).populate('course', 'code title color');
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ task });
}

export async function deleteTask(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId, deletedAt: null },
    { deletedAt: new Date() }
  );
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ ok: true });
}