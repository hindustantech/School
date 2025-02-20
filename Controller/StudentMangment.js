import Student from '../Modal/Student.js'; // Adjust path if needed

// Add a new student
const addStudent = async (req, res) => {
    try {
        const { name, phone, rollno, email } = req.body;

        // Check if all fields are provided
        if (!name || !phone || !rollno || !email) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Create new student
        const student = new Student({ name, phone, rollno, email });
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
        const students = await Student.find(); // Retrieve all students
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export { addStudent, deleteStudent, updateStudent, getStudent, getAllStudents };