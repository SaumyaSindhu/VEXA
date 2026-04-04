import { Router } from 'express';
import { sendMessageController, getChatsController, getMessagesController, deleteChatController, streamMessageController } from '../controllers/chat.controller.js';
import { authUser } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimiter.middleware.js';

const chatRouter = Router();

chatRouter.post("/message", authUser,aiLimiter, sendMessageController)

chatRouter.get("/", authUser, getChatsController)

chatRouter.get("/:chatId/messages", authUser, getMessagesController)

chatRouter.delete("/:chatId", authUser, deleteChatController)

chatRouter.post("/stream", authUser, aiLimiter, streamMessageController);

export default chatRouter;