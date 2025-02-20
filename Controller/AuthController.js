import bcrypt from 'bcrypt';
import Teacher from '../Modal/Teacher.js';
import jwt from 'jsonwebtoken';

export const Register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Basic input check
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: 'Name, email, and password required' });
        }

        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt rounds

        // Create new teacher
        const teacher = new Teacher({
            email,
            name,
            password: hashedPassword,
        });

        // Generate initial tokens
        const accessToken = jwt.sign(
            { id: teacher._id, email: teacher.email },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: teacher._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Save refresh token to teacher
        teacher.refreshToken = refreshToken;
        await teacher.save();

        // Send response with tokens
        res.status(201).json({
            success: true,
            accessToken,
            refreshToken,
            data: { name: teacher.name, email: teacher.email },
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



// Login with JWT
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate tokens automatically
        const accessToken = generateAccessToken(teacher);
        const refreshToken = generateRefreshToken(teacher);

        // Store refresh token in database
        teacher.refreshToken = refreshToken;
        await teacher.save();

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            data: {
                id:teacher._id,
                name: teacher.name,
                email: teacher.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const RefreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ success: false, message: 'Refresh token required' });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
        }

        // Find teacher with matching refresh token
        const teacher = await Teacher.findOne({
            _id: decoded.id,
            refreshToken: refreshToken
        });

        if (!teacher) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        // Automatically generate new tokens
        const newAccessToken = generateAccessToken(teacher);
        const newRefreshToken = generateRefreshToken(teacher);

        // Update refresh token in database
        teacher.refreshToken = newRefreshToken;
        await teacher.save();

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_ACCESS_SECRET,
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
    );
};