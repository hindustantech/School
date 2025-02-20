import jwt from 'jsonwebtoken';
import Teacher from '../Modal/Teacher.js'; // Your Teacher model

// Middleware to check user via access token
export const protect = async (req, res, next) => {
    try {
        // Get token from Authorization header (Bearer token)
        const token = req.headers.authorization?.split(' ')[1]; // Expects "Bearer <token>"

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Find teacher by decoded ID
        const teacher = await Teacher.findById(decoded.id);
        if (!teacher) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Attach teacher to request object
        req.user = teacher;
        next(); // Proceed to next middleware or route
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

