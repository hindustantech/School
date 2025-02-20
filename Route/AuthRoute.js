import { Register, Login, RefreshToken } from "../Controller/AuthController.js";
import express from 'express'

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/refreshToken', RefreshToken);



export default router;