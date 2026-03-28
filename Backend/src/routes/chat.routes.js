import { Router } from 'express';
import { sendMessageController, getChatsController, getMessagesController, deleteChatController } from '../controllers/chat.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const chatRouter = Router();

chatRouter.post("/message", authUser, sendMessageController)

chatRouter.get("/", authUser, getChatsController)

chatRouter.get("/:chatId/messages", authUser, getMessagesController)

chatRouter.delete("/:chatId", authUser, deleteChatController)

export default chatRouter;