import express,{Router} from 'express';
import {getContacts, addContact, deleteContact} from '../Controllers/contactsControllers.js';
import userAuth from "../Middlewares/userAuth.js";

const router = Router();

router.get("/",userAuth,getContacts);
router.post("/addcontact",userAuth,addContact);
router.delete("/del_contact/:ownerId/:recipientId",deleteContact);

export default router;