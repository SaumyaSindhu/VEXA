import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessageController(req, res) {
    
    try {
        const { message, chat: chatId } = req.body;

        if(!message) {
            return res.status(400).json({
                message: "Message is required",
                success: false
            })
        }
        
        let title = null, chat = null;
        
        if (!chatId) {
            title = await generateChatTitle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title,
            });
        }

        // save user message
        const userMessage = await messageModel.create({
           chat: chatId || chat._id,
           content: message,
           role: "user",
         });
        
        // fetch history
        const messages = await messageModel.find({ chat: chatId || chat._id }).sort({ createdAt: 1 });

        // generate AI response
        const result = await generateResponse(messages);
        
        // save AI response
        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: result,
            role: "ai"
        })
        
        
        res.status(201).json({
            title,
            chat,
            aiMessage
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to generate response",
            success: false
        })
    }
}

export async function getChatsController(req, res) {
    try {
        const user = req.user

        const chats = await chatModel.find({ user: user.id }).sort({ updatedAt: -1 })

        res.status(200).json({
            message: "Chats retrieved successfully",
            chats
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch chats",
            success: false
        })
    }
}

export async function getMessagesController(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        })

        if(!chat) {
            return res.status(404).json({
                message: "Chat not found"
            })
        }

        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 })

        res.status(200).json({
            message: "Messages retrieved successfully",
            messages
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch messages",
            success: false
        })
    }
}

export async function deleteChatController(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: req.user.id
        })

        await messageModel.deleteMany({
            chat: chatId
        })

        if (!chat) {
            return res.status(200).json({
                message: "Chat not found"
            })
        }

        res.status(200).json({
            message: "Chat deleted successfully"
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete chat",
            success: false
        })
    }
}