import Student from '../Modal/Student.js'; // Adjust path if needed
import mongoose from 'mongoose';
// Add a new student
const addStudent = async (req, res) => {
    try {
        const teacherId = req.user.id || req.user._id;
        const { name, phone, rollno, email } = req.body;

        console.log("teacherId", teacherId);
        if (!teacherId) {
            return res.status(401).json({ success: false, message: 'UnAuthorized' });
        }
        if (!name || !phone || !rollno || !email) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Create new student
        const student = new Student({ name, phone, rollno, email, teacherId });
        await student.save();

        res.status(201).json({ success: true, message: 'Student added successfully', data: student });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error (e.g., phone or email)
            return res.status(400).json({ success: false, message: 'Phone or email already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete a student by ID
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params; // Assuming ID is passed as a route parameter

        const student = await Student.findByIdAndDelete(id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update a student by ID
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, rollno, email } = req.body;

        const student = await Student.findByIdAndUpdate(
            id,
            { name, phone, rollno, email },
            { new: true, runValidators: true } // Return updated doc, validate fields
        );

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.status(200).json({ success: true, message: 'Student updated successfully', data: student });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Phone or email already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get a particular student by ID
const getStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


const getAllStudents = async (req, res) => {
    try {
        const teacherId = req.user.id;
        console.log("teacherId",teacherId);

        // Validate teacherId
        if (!teacherId) {
            return res.status(400).json({
                success: false,
                message: 'teacherId is required in the request body'
            });
        }

        // Check if teacherId is a valid ObjectId (optional, if using MongoDB)
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid teacherId format'
            });
        }

        // Fetch students with the given teacherId and populate teacher details
        const students = await Student.find({ teacherId })

        // Check if any students were found
        if (!students || students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No students found for this teacher'
            });
        }

        // Return success response with data
        res.status(200).json({
            success: true,
            message: 'Students retrieved successfully',
            data: students
        });
    } catch (error) {
        // Log the error for debugging (optional)
        console.error('Error in getAllStudents:', error);

        // Return detailed error response
        res.status(500).json({
            success: false,
            message: 'Server error occurred while fetching students',
            error: error.message
        });
    }
};

export { addStudent, deleteStudent, updateStudent, getStudent, getAllStudents };