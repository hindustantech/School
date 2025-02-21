// Get a particular student by ID
import T from "../Modal/T.js";

 export const getText = async (req, res) => {
    try {

        const student = await T.find();
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};