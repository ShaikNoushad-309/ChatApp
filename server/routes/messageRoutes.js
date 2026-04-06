import express,{Router} from "express";
import userAuth from "../Middlewares/userAuth.js";
import {addMessage, getMessages,getConversationId} from "../Controllers/messagesControllers.js";

const router = express.Router();

router.get("/:contactId",userAuth,getMessages);
router.post("/addmsg/:contactId",userAuth,addMessage);
router.post('/conversation-id', getConversationId);

export default router;