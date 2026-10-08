import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller.js';


const router = Router();
router.use(requireAuth);

router.get('/', listCourses);
router.post('/', createCourse);
router.patch('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;