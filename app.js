import express, { json } from 'express';
import cors from 'cors';
// import authRoutes from './routes/auth';
import connectDB from './Config/db.js';
import { config } from 'dotenv';
import chalk from 'chalk';
import AuthRoute from './Route/AuthRoute.js'
import StudentMangment from './Route/StudentManagment.js'
config();
const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api/v1/auth', AuthRoute);

app.use('/api/v1/auth', StudentMangment);


const PORT = process.env.PORT || 5000;

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Welcome to School Management System ');
});

app.listen(PORT, () => {
    console.log(chalk.white.bgGreenBright(` 🚀 Server running on http://localhost:${PORT} `));
});