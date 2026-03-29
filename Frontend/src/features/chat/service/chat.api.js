import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function sendMessage({ message, chatId }) {
    
    try {
        const response = await api.post("/api/chat/message", {
            message,
            chat: chatId
        });

        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to send message" };
    }
}

export async function getChats() {
    
    try {
        const response = await api.get("/api/chat/");

        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to get chats" };
    }
}

export async function getMessages(chatId) {
    try {
        const response = await api.get(`/api/chat/${chatId}/messages`);

        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to get messages" };
    }
}

export async function deleteChat(chatId) {
    const response = await api.delete(`/api/chat/${chatId}`);

    return response.data;
}