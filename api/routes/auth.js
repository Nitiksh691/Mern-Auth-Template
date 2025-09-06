// routes/auth.js
import express from 'express';
import { signup, login, logout, sendOTP,verifyOTP,resetPassword} from '../controller/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post("/sendotp",sendOTP);
router.post("/verifyotp",verifyOTP);
router.post("/resetpassword",resetPassword);



router.get('/logout', logout);

export default router;
