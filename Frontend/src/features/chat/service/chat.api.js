import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function sendMessage({ message, chatId }) {
  try {
    const response = await api.post("/api/chat/message", {
      message,
      chat: chatId,
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

export async function streamMessage({ message, chatId, onToken }) {
  const response = await fetch("http://localhost:3000/api/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      message,
      chat: chatId,
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n\n");

    for (let line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.replace("data: ", "");

        if (data === "[DONE]") return;

        const parsed = JSON.parse(data);

        if (parsed.token) {
          onToken(parsed.token); 
        }
      }
    }
  }
}