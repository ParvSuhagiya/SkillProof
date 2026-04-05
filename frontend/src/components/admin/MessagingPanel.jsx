import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/api';

const MessagingPanel = () => {
  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const loadInbox = async () => {
    try {
      const data = await api.get('/messages/inbox');
      setConversations(data.conversations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (contact) => {
    setActiveContact(contact);
    try {
      const data = await api.get(`/messages/conversation/${contact._id}`);
      setMessages(data.messages || []);
      // Refresh inbox to clear unread count
      loadInbox();
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeContact) return;
    setSending(true);
    try {
      await api.post('/messages/send', {
        receiverId: activeContact._id,
        content: newMessage.trim()
      });
      setNewMessage('');
      loadConversation(activeContact);
    } catch (err) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => { loadInbox(); }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden" style={{ height: '520px' }}>
      <div className="flex h-full">
        {/* Sidebar — conversation list */}
        <div className="w-64 border-r border-white/10 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-white/5">
            <h3 className="text-xs font-semibold text-white">Messages</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-xs text-gray-600 text-center py-8">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-8 px-3">
                No conversations yet. Hire a recruiter to start messaging.
              </p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.contact._id}
                  onClick={() => loadConversation(conv.contact)}
                  className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition ${
                    activeContact?._id === conv.contact._id ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-bold shrink-0">
                        {conv.contact.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-300 truncate max-w-[100px]">{conv.contact.username}</span>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate mt-1 pl-8">
                    {conv.lastMessage.content}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex flex-col flex-1 min-w-0">
          {activeContact ? (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-bold">
                  {activeContact.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{activeContact.username}</p>
                  <p className="text-xs text-gray-600 capitalize">{activeContact.role}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.sender._id === msg.sender._id &&
                    msg.sender.username === currentUser?.username;
                  // Use sender username vs current user
                  const isMine = msg.sender.username === currentUser?.username;
                  return (
                    <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg px-3 py-2 ${
                        isMine
                          ? 'bg-blue-600/80 text-white'
                          : 'bg-white/5 border border-white/10 text-gray-300'
                      }`}>
                        <p className="text-xs">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-600'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-md px-3 py-2 text-xs text-gray-300 placeholder-gray-600 outline-none focus:border-blue-500/50 transition"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="text-xs text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 px-3 py-2 rounded transition"
                >
                  {sending ? '...' : '↑ Send'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-gray-600">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPanel;
