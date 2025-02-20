import { addStudent, updateStudent, deleteStudent, getStudent, getAllStudents } from '../Controller/StudentMangment.js';
import express from 'express'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/addStudent', protect, addStudent);
router.put('/updateStudent/:id', protect, updateStudent);
router.delete('/deleteStudent/:id', protect, deleteStudent);
router.get('/getStudent/:id', protect, getStudent);
router.get('/getAllStudents', protect, getAllStudents);




export default router;