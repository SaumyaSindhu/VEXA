import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
      try {
        dispatch(setLoading(true));

        const data = await sendMessage({ message, chatId });
        const { chat, aiMessage } = data;

        if (!chatId) {
          dispatch(
            createNewChat({
              chatId: chat._id,
              title: chat.title,
            }),
          );
        }

        dispatch(
          addNewMessage({
            chatId: chatId || chat._id,
            content: message,
            role: "user",
          }),
        );

        dispatch(
          addNewMessage({
            chatId: chatId || chat._id,
            content: aiMessage.content,
            role: aiMessage.role,
          }),
        );

        dispatch(setCurrentChatId(chatId || chat._id));
      } catch (err) {
        dispatch(setError(err?.message || "Failed to send message"));
      } finally {
        dispatch(setLoading(false));
      }
  }

  async function handleGetChats() {
    try {
      dispatch(setLoading(true));

      const data = await getChats();
      const { chats } = data;

      // 🔹 Transform array → object
      const formattedChats = chats.reduce((acc, chat) => {
        acc[chat._id] = {
          id: chat._id,
          title: chat.title,
          messages: [],
          lastUpdated: chat.updatedAt,
        };
        return acc;
      }, {});

      dispatch(setChats(formattedChats));
    } catch (err) {
      dispatch(setError(err?.message || "Failed to fetch chats"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleOpenChat(chatId, chats) {
    try {
      dispatch(setLoading(true));

      console.log(chats[chatId]?.messages?.length);

      if (!chats[chatId]?.messages || chats[chatId].messages.length === 0) {
        const data = await getMessages(chatId);
        const { messages } = data;

        const formattedMessages = messages.map((msg) => ({
          content: msg.content,
          role: msg.role,
        }));

        dispatch(
          addMessages({
            chatId,
            messages: formattedMessages,
          }),
        );
      }

      dispatch(setCurrentChatId(chatId));
    } catch (err) {
      dispatch(setError(err?.message || "Failed to load messages"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat
  };
};
