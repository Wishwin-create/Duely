import mongoose from 'mongoose';
import { z } from 'zod';
import Course from '../models/Course.js';

const courseSchema = z.object({
  semester: z.string().trim().min(1).max(20),
  code: z.string().trim().min(1).max(20),
  title: z.string().trim().min(1).max(100),
  credits: z.number().min(0).max(30).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

const updateSchema = courseSchema.partial();

export async function listCourses(req, res) {
  const filter = { user: req.userId };
  if (typeof req.query.semester === 'string' && req.query.semester) {
    filter.semester = req.query.semester;
  }
  const courses = await Course.find(filter).sort({ semester: 1, code: 1 });
  res.json({ courses });
}

export async function createCourse(req, res) {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
  }
  const course = await Course.create({ ...parsed.data, user: req.userId });
  res.status(201).json({ course });
}

export async function updateCourse(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
  }
  const course = await Course.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    parsed.data,
    { new: true }
  );
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json({ course });
}

export async function deleteCourse(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const course = await Course.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json({ ok: true });
}