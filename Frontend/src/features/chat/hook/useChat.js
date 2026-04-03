import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat, streamMessage } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages, updateStreamingMessage, deleteChatLocal } from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
      try {
        dispatch(setLoading(true));

        const USE_STREAMING = true;

        if (USE_STREAMING) {
          let activeChatId = chatId;

          if (!chatId) {
            const data = await sendMessage({ message, chatId: null });
            const { chat } = data;

            dispatch(
              createNewChat({
                chatId: chat._id,
                title: chat.title,
              }),
            );

            activeChatId = chat._id;
            dispatch(setCurrentChatId(activeChatId));
          }

          dispatch(
            addNewMessage({
              chatId: activeChatId,
              content: message,
              role: "user",
            }),
          );

          let buffer = "";
          let fullText = "";
          let typingInterval = null;

          // STREAM TOKENS
          await streamMessage({
            message,
            chatId: activeChatId,
            onToken: (token) => {
              buffer += token;

              // start typing loop once
              if (!typingInterval) {
                typingInterval = setInterval(() => {
                  if (buffer.length > 0) {
                    // control typing speed here
                    const chunk = buffer.slice(0, 2); // adjust speed
                    buffer = buffer.slice(2);

                    fullText += chunk;

                    dispatch(
                      updateStreamingMessage({
                        chatId: activeChatId,
                        content: fullText,
                      }),
                    );
                  } else if (buffer.length === 0) {
                    clearInterval(typingInterval);
                    typingInterval = null;
                  }
                }, 30); // speed control (lower = faster)
              }
            },
          });

          // after stream finishes flush buffer
          await new Promise((resolve) => {
            const check = setInterval(() => {
              if (!typingInterval) {
                clearInterval(check);
                resolve();
              }
            }, 10);
          });

          return;
        }

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

  async function handleDeleteChat(chatId) {
    try {
      dispatch(setLoading(true));

      await deleteChat(chatId);

      dispatch(deleteChatLocal(chatId));

    } catch (err) {
      dispatch(setError(err?.message || "Failed to delete chat"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat
  };
};
