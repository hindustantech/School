import { Register, Login, RefreshToken,AddData } from "../Controller/AuthController.js";
import express from 'express'
import { getText } from "../Controller/T.js";
const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/refreshToken', RefreshToken);
router.get('/t',getText);
router.post('/at',AddData);


export default router;