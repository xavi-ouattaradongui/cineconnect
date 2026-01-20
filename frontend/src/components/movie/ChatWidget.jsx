import { Send } from "lucide-react";
import { useRef, useEffect } from "react";
import AvatarBubble from "./AvatarBubble";

export default function ChatWidget({
  chatMessages,
  messageText,
  chatCollapsed,
  onSendMessage,
  onMessageChange,
  onToggleCollapse,
  movieTitle, // nouveau
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <div className="mb-0 w-[28rem] bg-white dark:bg-[#16191D] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-white/5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shrink-0"></div>
            <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              Communauté • {movieTitle}
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="px-1 rounded hover:bg-gray-200/60 dark:hover:bg-white/10 text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0"
            title={chatCollapsed ? "Développer" : "Réduire"}
          >
            •••
          </button>
        </div>

        {/* Messages */}
        {!chatCollapsed && (
          <div className="h-64 p-3 overflow-y-auto space-y-3 bg-white dark:bg-[#0f1114]">
            {chatMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                  Aucun message pour le moment
                </p>
              </div>
            ) : (
              chatMessages.map((msg) =>
                msg.isOwn ? (
                  <div
                    key={msg.id}
                    className="flex gap-2 flex-row-reverse items-start"
                  >
                    <AvatarBubble
                      avatar={msg.avatar}
                      initials={msg.avatarInitials}
                      size={24}
                    />
                    <div className="bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/20 dark:border-indigo-500/20 p-2 rounded-lg rounded-tr-none max-w-[80%]">
                      <p className="text-[11px] text-indigo-700 dark:text-indigo-100">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex gap-2 items-start">
                    <AvatarBubble
                      avatar={msg.avatar}
                      initials={msg.avatarInitials}
                      size={24}
                    />
                    <div className="bg-gray-100 dark:bg-white/5 p-2 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-[11px] text-gray-700 dark:text-slate-300">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                )
              )
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Input */}
        {!chatCollapsed && (
          <form
            onSubmit={onSendMessage}
            className="p-3 bg-white dark:bg-[#16191D] border-t border-gray-200 dark:border-white/5"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={messageText}
                onChange={onMessageChange}
                placeholder="Écrire un message..."
                className="w-full bg-gray-100 dark:bg-black/20 text-black dark:text-white text-xs px-3 py-2 rounded-md border border-gray-200 dark:border-white/10 focus:border-indigo-500/50 focus:ring-0 outline-none placeholder:text-gray-400"
              />
              <button
                className="absolute right-2 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors disabled:opacity-40"
                disabled={!messageText.trim()}
                title="Envoyer"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
