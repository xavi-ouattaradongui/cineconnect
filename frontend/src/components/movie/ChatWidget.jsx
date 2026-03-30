import { Send, Users } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import AvatarBubble from "./AvatarBubble";

export default function ChatWidget({
  chatMessages,
  messageText,
  chatCollapsed,
  onSendMessage,
  onMessageChange,
  onToggleCollapse,
  movieTitle,
  currentUserId,
  onDeleteMessage,
  lastSeenAt,
}) {
  const chatEndRef = useRef(null);
  const firstNewRef = useRef(null);
  const isCollapsed = !chatCollapsed;

  // Déplace la déclaration ici (avant toute utilisation)
  const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const getMessageDate = (msg) => {
    const raw = msg?.createdAt ?? msg?.timestamp ?? msg?.time ?? null;
    if (!raw) return null;

    if (typeof raw === "string") {
      if (raw.endsWith("Z")) {
        const localIso = raw.replace("Z", "");
        const dLocal = new Date(localIso);
        return Number.isNaN(dLocal.getTime()) ? null : dLocal;
      }
      const dStr = new Date(raw);
      return Number.isNaN(dStr.getTime()) ? null : dStr;
    }

    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const getYmd = (date) => {
    const parts = new Intl.DateTimeFormat("fr-FR", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const y = parts.find((p) => p.type === "year")?.value;
    const m = parts.find((p) => p.type === "month")?.value;
    const d = parts.find((p) => p.type === "day")?.value;
    return { y: Number(y), m: Number(m), d: Number(d) };
  };

  const toStartOfDay = ({ y, m, d }) => new Date(y, m - 1, d);

  const formatDayLabel = (date) => {
    const today = new Date();
    const diffDays =
      (toStartOfDay(getYmd(today)) - toStartOfDay(getYmd(date))) /
      (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "Aujourd’hui";
    if (diffDays === 1) return "Hier";
    if (diffDays <= 2) {
      return new Intl.DateTimeFormat("fr-FR", {
        timeZone: TIME_ZONE,
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(date);
    }
    // Format court: "jeu. 5 févr."
    const parts = new Intl.DateTimeFormat("fr-FR", {
      timeZone: TIME_ZONE,
      weekday: "short",
      day: "numeric",
      month: "short",
    }).formatToParts(date);

    const wd = parts.find(p => p.type === "weekday")?.value?.replace(/\.$/, "") || "";
    const d = parts.find(p => p.type === "day")?.value || "";
    let mo = parts.find(p => p.type === "month")?.value || "";

    // Correction manuelle pour "févr." (certains navigateurs mettent "févr." d'autres "fév.")
    if (mo === "fév") mo = "févr.";

    // Ajoute un point à la fin du mois si absent (sauf si déjà présent)
    if (!mo.endsWith(".")) mo = mo + ".";

    return `${wd}. ${d} ${mo}`;
  };

  // Ajoute une fonction pour savoir si on doit afficher la date complète sous le message
  const shouldShowFullDate = (date) => {
    const today = new Date();
    const diffDays =
      (toStartOfDay(getYmd(today)) - toStartOfDay(getYmd(date))) /
      (1000 * 60 * 60 * 24);
    return diffDays > 2;
  };

  const formatTime = (date) =>
    new Intl.DateTimeFormat("fr-FR", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  const getInitials = (msg) => {
    if (msg?.avatarInitials) return msg.avatarInitials;
    const base = msg?.displayName || msg?.username || "?";
    return base
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = (msg) => msg?.displayName || msg?.username || "Utilisateur";

  const NAME_GRADIENTS = [
    "from-rose-500 to-pink-600",
    "from-fuchsia-500 to-purple-600",
    "from-purple-500 to-violet-600",
    "from-indigo-500 to-blue-600",
    "from-blue-500 to-sky-600",
    "from-sky-500 to-cyan-600",
    "from-cyan-500 to-teal-600",
    "from-teal-500 to-emerald-600",
    "from-emerald-500 to-green-600",
    "from-green-500 to-lime-600",
    "from-lime-500 to-yellow-500",
    "from-yellow-500 to-amber-600",
    "from-amber-500 to-orange-600",
    "from-orange-500 to-red-600",
    "from-red-500 to-rose-600",
    "from-pink-500 to-rose-500",
    "from-violet-500 to-fuchsia-600",
    "from-blue-600 to-indigo-700",
    "from-cyan-600 to-blue-700",
    "from-teal-600 to-cyan-500",
    "from-emerald-600 to-teal-500",
    "from-green-600 to-emerald-500",
    "from-lime-600 to-green-500",
    "from-amber-600 to-yellow-500",
    "from-orange-600 to-amber-500",
    "from-red-600 to-orange-500",
    "from-slate-500 to-gray-700",
    "from-neutral-500 to-stone-600",
  ];

  const getNameGradient = (msg) => {
    const key = String(msg?.userId ?? msg?.displayName ?? msg?.username ?? "anon");
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) % 2147483647;
    return NAME_GRADIENTS[hash % NAME_GRADIENTS.length];
  };

  const [actionForId, setActionForId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const getReplyName = (msg) => (msg?.deleted ? "Message supprimé" : msg?.displayName || msg?.username || "Utilisateur");
  const getReplySnippet = (msg) => {
    if (msg?.deleted) return "Message supprimé";
    const text = msg?.text ?? msg?.content ?? "";
    return text.length > 80 ? `${text.slice(0, 80)}…` : text;
  };

  const isDeletedMessage = (msg) =>
    !!msg?.deletedAt || msg?.text === "Message supprimé" || msg?.content === "Message supprimé";

  const getMessageText = (msg) => (isDeletedMessage(msg) ? "Message supprimé" : msg?.text ?? msg?.content);

  const handleSend = (e) => {
    onSendMessage?.(e, replyTo);
    if (messageText.trim()) setReplyTo(null);
  };

  const handleReply = (msg) => {
    if (isDeletedMessage(msg)) return;
    setReplyTo({
      id: msg.id,
      userId: msg.userId,
      displayName: getDisplayName(msg),
      text: msg.text ?? msg.content,
    });
    setActionForId(null);
  };

  const handleDelete = (msg) => {
    onDeleteMessage?.(msg);
    setActionForId(null);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Trouve l'index du premier message non vu
  const lastSeenDate = lastSeenAt ? new Date(lastSeenAt) : null;
  const firstNewIndex = lastSeenDate
    ? chatMessages.findIndex(msg => {
        const msgDate = getMessageDate(msg);
        return msgDate && msgDate > lastSeenDate;
      })
    : -1;

  // Si l'utilisateur a envoyé un message après lastSeenAt, on ne montre plus "Nouveau"
  const hasOwnNewMessage = lastSeenDate
    ? chatMessages.some(
        (msg) =>
          String(msg.userId) === String(currentUserId) &&
          getMessageDate(msg) &&
          getMessageDate(msg) > lastSeenDate
      )
    : false;

  // Scroll automatique sur "Nouveau" ou tout en bas
  useEffect(() => {
    if (!isCollapsed) {
      if (firstNewRef.current && firstNewIndex !== -1 && !hasOwnNewMessage) {
        firstNewRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
    // eslint-disable-next-line
  }, [chatCollapsed, chatMessages, firstNewIndex, hasOwnNewMessage]);

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {isCollapsed && (
        <div className="flex items-center justify-end sm:justify-between gap-2 w-full">
          <span className="hidden sm:inline text-xs text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-black/40 px-2 py-1 rounded-md border border-gray-200 dark:border-white/10">
            Rejoins la communauté de {movieTitle}
          </span>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="h-14 w-14 sm:h-24 sm:w-24 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 animate-bounce flex items-center justify-center"
            title="Discuter"
          >
            <Users size={28} className="sm:hidden" />
            <Users size={45} className="hidden sm:block" />
          </button>
        </div>
      )}

      {!isCollapsed && (
        <div className="mb-0 w-full sm:w-[38rem] max-w-[calc(100vw-2rem)] bg-white dark:bg-[#16191D] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
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
            title={isCollapsed ? "Développer" : "Réduire"}
           >
            •••
           </button>
          </div>

          {/* Messages */}
          {!isCollapsed && (
            <div
              className="h-[50vh] sm:h-[32rem] p-3 overflow-y-auto space-y-3 bg-white dark:bg-[#0f1114]"
              onClick={() => setActionForId(null)}
            >
              {chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">
                    Aucun message pour le moment
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, index) => {
                  const isOwn = String(msg.userId) === String(currentUserId);
                  const msgDate = getMessageDate(msg);
                  const prevDate = getMessageDate(chatMessages[index - 1]);
                  const showDaySeparator =
                    msgDate &&
                    (!prevDate ||
                      formatDayLabel(msgDate) !== formatDayLabel(prevDate));

                  return (
                    <div key={msg.id} className="space-y-2">
                      {/* Séparateur "Nouveaux messages" */}
                      {index === firstNewIndex && !hasOwnNewMessage && (
                        <div
                          className="flex items-center my-4"
                          ref={firstNewRef}
                        >
                          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
                          <span className="mx-4 px-3 py-0.5 text-xs font-bold rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 shadow">
                            Nouveaux messages
                          </span>
                          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
                        </div>
                      )}

                      {showDaySeparator && (
                        <div className="flex items-center justify-center">
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-slate-400">
                            {formatDayLabel(msgDate)}
                          </span>
                        </div>
                      )}

                      {isOwn ? (
                        <div className="flex gap-2 flex-row-reverse items-start">
                          <AvatarBubble
                            avatar={msg.avatar}
                            initials={getInitials(msg)}
                            size={24}
                          />
                          <div className="max-w-[80%] relative flex flex-col">
                            <div
                              className="bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/20 dark:border-indigo-500/20 p-2 rounded-lg rounded-tr-none cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActionForId((prev) => (prev === msg.id ? null : msg.id));
                              }}
                            >
                              {msg.replyTo?.id && (
                                <div className="mb-1 px-2 py-1 rounded border-l-2 border-indigo-300 dark:border-indigo-400/60 bg-white/50 dark:bg-black/20">
                                  <p className="text-[9px] text-indigo-600 dark:text-indigo-200 font-semibold">
                                    {getReplyName(msg.replyTo)}
                                  </p>
                                  <p className="text-[9px] text-indigo-700/80 dark:text-indigo-100/80">
                                    {getReplySnippet(msg.replyTo)}
                                  </p>
                                </div>
                              )}
                              <p className="text-[11px] text-indigo-700 dark:text-indigo-100 break-words">
                                {getMessageText(msg)}
                              </p>
                            </div>
                            {actionForId === msg.id && (
                              <div
                                className="absolute right-0 mt-1 z-10 bg-white dark:bg-[#16191D] border border-gray-200 dark:border-white/10 rounded-md shadow-lg text-[10px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Affiche "Supprimer" seulement pour ses propres messages */}
                                <button
                                  type="button"
                                  onClick={() => handleDelete(msg)}
                                  className="block w-full text-left px-2 py-1 text-red-600 hover:bg-gray-100 dark:hover:bg-white/5"
                                >
                                  Supprimer
                                </button>
                                {!isDeletedMessage(msg) && (
                                  <button
                                    type="button"
                                    onClick={() => handleReply(msg)}
                                    className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-white/5"
                                  >
                                    Répondre
                                  </button>
                                )}
                              </div>
                            )}
                            {msgDate && (
                              <p className="mt-1 text-[9px] text-indigo-500/80 dark:text-indigo-200/80 text-right w-full">
                                {formatTime(msgDate)}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-start">
                          <AvatarBubble
                            avatar={msg.avatar}
                            initials={getInitials(msg)}
                            size={24}
                          />
                          <div className="max-w-[80%] relative flex flex-col">
                            <p
                              className={`mb-1 text-[10px] font-semibold bg-gradient-to-r bg-clip-text text-transparent ${getNameGradient(msg)}`}
                            >
                              {getDisplayName(msg)}
                            </p>
                            <div
                              className="bg-gray-100 dark:bg-white/5 p-2 rounded-lg rounded-tl-none cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActionForId((prev) => (prev === msg.id ? null : msg.id));
                              }}
                            >
                              {msg.replyTo?.id && (
                                <div className="mb-1 px-2 py-1 rounded border-l-2 border-gray-300 dark:border-white/20 bg-white/70 dark:bg-black/20">
                                  <p className="text-[9px] text-gray-600 dark:text-slate-300 font-semibold">
                                    {getReplyName(msg.replyTo)}
                                  </p>
                                  <p className="text-[9px] text-gray-600/80 dark:text-slate-300/80">
                                    {getReplySnippet(msg.replyTo)}
                                  </p>
                                </div>
                              )}
                              <p className="text-[11px] text-gray-700 dark:text-slate-300 break-words">
                                {getMessageText(msg)}
                              </p>
                            </div>
                            {actionForId === msg.id && (
                              <div
                                className="absolute left-0 mt-1 z-10 bg-white dark:bg-[#16191D] border border-gray-200 dark:border-white/10 rounded-md shadow-lg text-[10px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Affiche "Supprimer" seulement si c'est le message de l'utilisateur courant */}
                                {String(msg.userId) === String(currentUserId) && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(msg)}
                                  className="block w-full text-left px-2 py-1 text-red-600 hover:bg-gray-100 dark:hover:bg-white/5"
                                >
                                  Supprimer
                                </button>
                                )}
                                {!isDeletedMessage(msg) && (
                                  <button
                                    type="button"
                                    onClick={() => handleReply(msg)}
                                    className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-white/5"
                                  >
                                    Répondre
                                  </button>
                                )}
                              </div>
                            )}
                            {msgDate && (
                              <p className="mt-1 text-[9px] text-gray-500 dark:text-slate-400 text-right w-full">
                                {formatTime(msgDate)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Input */}
          {!isCollapsed && (
            <form
              onSubmit={handleSend}
              className="p-3 bg-white dark:bg-[#16191D] border-t border-gray-200 dark:border-white/5"
            >
              {replyTo && (
                <div className="mb-2 px-2 py-1 rounded border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-600 dark:text-slate-300 font-semibold">
                      Réponse à {getReplyName(replyTo)}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                      {getReplySnippet(replyTo)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    title="Annuler"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="relative flex items-center">
                {/* Remplacement de l'input par un textarea */}
                <textarea
                  value={messageText}
                  onChange={onMessageChange}
                  placeholder="Écrire un message..."
                  className="w-full bg-gray-100 dark:bg-black/20 text-black dark:text-white text-xs px-3 py-2 pr-5 rounded-md border border-gray-200 dark:border-white/10 focus:border-indigo-500/50 focus:ring-0 outline-none placeholder:text-gray-400 resize-none overflow-y-auto"
                  rows={1}
                  style={{ minHeight: 28, maxHeight: 60 }}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (messageText.trim()) handleSend(e);
                    }
                  }}
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
      )}
    </div>
  );
}
