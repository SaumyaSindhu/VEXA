import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {}, // used object{} instead of array[] cause it is better for fast access and scalable
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    createNewChat: (state, action) => {
        const { chatId, title } = action.payload
        state.chats[ chatId ] = {
            id: chatId,
            title,
            messages: [],
            lastUpdated: new Date().toISOString()
        }
    },
    addNewMessage: (state, action) => {
        const { chatId, content, role } = action.payload
        state.chats[ chatId ].messages.push({ content, role })
        state.chats[chatId].lastUpdated = new Date().toISOString();
    },
    addMessages: (state, action) => {
        const { chatId, messages } = action.payload
        state.chats[ chatId ].messages.push(...messages)
    },
    updateStreamingMessage: (state, action) => {
        const { chatId, content } = action.payload;

        if (!state.chats[chatId]) return;

        const messages = state.chats[chatId].messages;
        const last = messages[messages.length - 1];

        if (last && last.role === "ai") {
            last.content = content;
        } else {
            messages.push({ role: "ai", content });
        }
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, updateStreamingMessage } = chatSlice.actions
export default chatSlice.reducer