import express,{Router} from 'express';
import {getContacts,addContact} from '../Controllers/contactsControllers.js';
import userAuth from "../Middlewares/userAuth.js";

const router = Router();

router.get("/",userAuth,getContacts);
router.post("/",userAuth,addContact);
router.delete("/:contactId",userAuth,addContact);