import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useChat } from "../hook/useChat.js";
import { setCurrentChatId } from "../chat.slice.js";
import ReactMarkdown from "react-markdown";
import "../styles/dashboard.scss";

// Icon Components
const Icons = {
  Logo: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Plus: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  MessageCircle: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Settings: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  ),
  Globe: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Paperclip: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  Copy: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  ThumbUp: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  ),
  Share: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Sparkle: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.88 5.68a2 2 0 0 0 1.27 1.27L21 12l-5.68 1.88a2 2 0 0 0-1.27 1.27L12 21l-1.88-5.68a2 2 0 0 0-1.27-1.27L3 12l5.68-1.88a2 2 0 0 0 1.27-1.27z" />
    </svg>
  ),
  PanelLeft: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  ),
  Trash: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
};

// Static Data
const SUGGESTION_CARDS = [
  {
    icon: "🌐",
    title: "Search the web in real-time",
    desc: "Get up-to-date answers with live sources",
  },
  {
    icon: "📊",
    title: "Analyze data & documents",
    desc: "Upload files and extract insights instantly",
  },
  {
    icon: "💡",
    title: "Brainstorm & ideate",
    desc: "Generate ideas, outlines, and creative content",
  },
  {
    icon: "⚡",
    title: "Write & debug code",
    desc: "Build faster with AI-powered coding assistance",
  },
];

// Dashboard Component
const Dashboard = () => {
  const chat = useChat();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { chats, currentChatId, isLoading } = useSelector(
    (state) => state.chat,
  );

  // Derive from Redux — no local state duplicates needed
  const messages = currentChatId ? chats[currentChatId]?.messages || [] : [];
  const chatHistory = Object.values(chats).sort(
    (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated),
  );

  const [inputValue, setInputValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  console.log(user);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  }, [inputValue]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // "ai" or "assistant" both treated as the AI side
  const isAiMessage = (role) => role === "ai" || role === "assistant";

  // For CSS class — always map AI roles to "assistant" so SCSS styles apply
  const getBubbleClass = (role) => (role === "user" ? "user" : "assistant");

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");
    chat.handleSendMessage({ message: text, chatId: currentChatId });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (title) => {
    setInputValue(title);
    textareaRef.current?.focus();
  };

  const handleDeleteChat = (chatId) => {
    setChatToDelete(chatId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      chat.handleDeleteChat(chatToDelete);
    }
    setShowDeleteConfirm(false);
    setChatToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setChatToDelete(null);
  };

  // Uses handleOpenChat so messages are fetched before switching view
  const handleHistoryClick = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  return (
    <div
      className={`dashboard${sidebarOpen ? " dashboard--sidebar-open" : ""}`}
    >
      {/* Backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="sidebar__backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? " sidebar--open" : ""}`}>
        {/* Logo */}
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <Icons.Logo />
          </div>
          <span className="sidebar__logo-name">
            VEX<span>A</span>
          </span>
        </div>

        {/* New Chat — clears currentChatId, shows welcome screen */}
        <button
          className="sidebar__new-chat"
          onClick={() => dispatch(setCurrentChatId(null))}
        >
          <Icons.Plus />
          New Chat
        </button>

        {/* Chat History */}
        <p className="sidebar__section-title">Recent</p>
        <div className="sidebar__history">
          {chatHistory.length === 0 && (
            <p className="sidebar__history-empty">No chats yet</p>
          )}
          {chatHistory.map((chatItem) => (
            <div
              key={chatItem.id}
              className={`sidebar__history-item${chatItem.id === currentChatId ? " sidebar__history-item--active" : ""}`}
              onClick={() => handleHistoryClick(chatItem.id)}
            >
              <Icons.MessageCircle />
              <span>{chatItem.title || "New Chat"}</span>
              <button
                className="sidebar__history-item-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chatItem.id);
                }}
                title="Delete chat"
              >
                <Icons.Trash />
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar__divider" />

        {/* User Profile */}
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">
            {getInitials(user?.name || user?.username)}
          </div>
          <div className="sidebar__user-info">
            <p className="sidebar__user-name">
              {user?.name || user?.username || "User"}
            </p>
            <p className="sidebar__user-plan">Pro Plan</p>
          </div>
          <Icons.ChevronRight />
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <main className="main">
        {/* Top Bar */}
        <div className="main__topbar">
          <button
            className="main__topbar-btn main__topbar-btn--toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            title="Toggle sidebar"
          >
            <Icons.PanelLeft />
          </button>
          <div className="main__topbar-right">
            <button className="main__topbar-btn">
              <Icons.Sparkle /> VEXA Pro
            </button>
            <button className="main__topbar-btn">
              <Icons.Settings /> Settings
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="main__content">
          {!currentChatId ? (
            /* Welcome / Empty State */
            <div className="main__welcome">
              <div className="main__welcome-badge">
                <span className="dot" />
                AI Online
              </div>
              <h1 className="main__welcome-title">
                What do you want to
                <br />
                <span>know today?</span>
              </h1>
              <p className="main__welcome-sub">
                VEXA searches the web in real-time and synthesizes answers from
                trusted sources — just ask anything.
              </p>
              <div className="main__suggestions">
                {SUGGESTION_CARDS.map((card) => (
                  <button
                    key={card.title}
                    className="main__suggestion-card"
                    onClick={() => handleSuggestionClick(card.title)}
                  >
                    <span className="main__suggestion-card-icon">
                      {card.icon}
                    </span>
                    <span className="main__suggestion-card-title">
                      {card.title}
                    </span>
                    <span className="main__suggestion-card-desc">
                      {card.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div className="chat__messages">
              {messages.map((msg, index) => (
                <div key={index}>
                  <div
                    className={`chat__message chat__message--${getBubbleClass(msg.role)}`}
                  >
                    <div className="chat__avatar">
                      {msg.role === "user"
                        ? getInitials(user?.name || user?.username)
                        : "V"}
                    </div>
                    <div className="chat__bubble">
                      {isAiMessage(msg.role) ? (
                        // ReactMarkdown renders headings, code blocks, lists, bold etc.
                        <div className="chat__markdown">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons only on AI messages */}
                  {isAiMessage(msg.role) && (
                    <div className="chat__actions">
                      <button className="chat__action-btn">
                        <Icons.Copy /> Copy
                      </button>
                      <button className="chat__action-btn">
                        <Icons.ThumbUp /> Good
                      </button>
                      <button className="chat__action-btn">
                        <Icons.Share /> Share
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator while waiting for AI */}
              {isLoading && (
                <div className="chat__message chat__message--assistant">
                  <div className="chat__avatar">V</div>
                  <div className="chat__bubble chat__bubble--typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="main__input-area">
          <div className="main__input-wrapper">
            <textarea
              ref={textareaRef}
              className="main__input-box"
              placeholder="Ask anything…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className="main__send-btn"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
            >
              <Icons.Send />
            </button>
          </div>
          <div className="main__input-footer">
            <div className="main__input-tools">
              <button className="main__tool-btn">
                <Icons.Globe /> Web Search
              </button>
              <button className="main__tool-btn">
                <Icons.Paperclip /> Attach
              </button>
            </div>
            <span className="main__input-hint">Shift + Enter for new line</span>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-modal">
          <div className="delete-modal__backdrop" onClick={cancelDelete} />
          <div className="delete-modal__content">
            <h3 className="delete-modal__title">Delete Chat</h3>
            <p className="delete-modal__message">
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </p>
            <div className="delete-modal__actions">
              <button
                className="delete-modal__btn delete-modal__btn--cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="delete-modal__btn delete-modal__btn--confirm"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;