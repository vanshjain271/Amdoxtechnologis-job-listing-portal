import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNotifications } from "../context/NotificationContext";
import { Send, ArrowLeft, MoreVertical, Search, MessageSquare } from "lucide-react";

const Chat = () => {
  const { id: conversationId } = useParams();
  const { user, token } = useAuth();
  const { socket } = useNotifications();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chat/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setConversations(res.data.conversations);
        if (conversationId) {
          const active = res.data.conversations.find((c) => c._id === conversationId);
          setActiveConversation(active);
        }
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      socket?.emit("join", conversationId);
    }
  }, [conversationId, socket]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        if (message.conversationId === conversationId) {
          setMessages((prev) => [...prev, message]);
        }
        fetchConversations(); // Refresh last message in list
      };

      socket.on("message", handleNewMessage);
      return () => socket.off("message", handleNewMessage);
    }
  }, [socket, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const receiver = activeConversation.participants.find((p) => p._id !== user.id);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat/messages",
        {
          receiverId: receiver._id,
          text: newMessage,
          conversationId: activeConversation._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setNewMessage("");
        // Socket should handle the local update too if room joined
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full text-slate-400">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-400 mr-3"></div>
      Loading chats...
    </div>
  );

  return (
    <div className="flex h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-900/50 ${conversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
            <Search size={18} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
              No conversations yet
            </div>
          ) : (
            conversations.map((conv) => {
              const otherUser = conv.participants.find((p) => p._id !== user.id);
              const isActive = conv._id === conversationId;
              
              return (
                <div
                  key={conv._id}
                  onClick={() => navigate(`/dashboard/chat/${conv._id}`)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-l-2
                    ${isActive 
                      ? 'bg-amber-400/10 border-amber-400' 
                      : 'border-transparent hover:bg-slate-800/50 hover:border-slate-700'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {otherUser?.fullName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="font-semibold text-slate-200 truncate">{otherUser?.fullName}</p>
                      <span className="text-[10px] text-slate-500">
                        {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {conv.lastMessage?.text || "Started a new conversation..."}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-slate-900/30 ${!conversationId ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50 backdrop-blur-md">
              <button onClick={() => navigate('/dashboard/chat')} className="md:hidden text-slate-400 hover:text-white">
                <ArrowLeft size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {activeConversation.participants.find(p => p._id !== user.id)?.fullName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">
                  {activeConversation.participants.find(p => p._id !== user.id)?.fullName}
                </h3>
                <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Online</p>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, idx) => {
                const isMine = msg.sender === user.id;
                return (
                  <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-lg
                      ${isMine 
                        ? 'bg-amber-400 text-slate-900 rounded-tr-none' 
                        : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}
                    >
                      {msg.text}
                      <div className={`text-[9px] mt-1 opacity-60 flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 bg-slate-900/50 border-t border-slate-800">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-400 text-slate-900 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-4 border border-slate-700 shadow-xl">
              <MessageSquare size={40} className="text-amber-400 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">Select a conversation</h3>
            <p className="text-sm max-w-xs">Connect with recruiters and candidates directly through real-time messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
