import {Router} from 'express';
import userAuth from "../Middlewares/userAuth.js";
import {getUserDetails} from "../Controllers/userControllers.js";

const router = Router();

router.get('/getuser',userAuth,getUserDetails);

export default router;