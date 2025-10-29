import {Router} from 'express';
import {register, login, logout, isAuthenticated} from '../controllers/authControllers.js';
import userAuth from "../Middlewares/userAuth.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/is-auth',userAuth,isAuthenticated);


export default router;
