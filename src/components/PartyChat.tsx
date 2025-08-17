'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePlayerSession } from '@/hooks/usePlayerSession';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSocket } from '@/hooks/useSocket';
import { Send, Users, Crown, MessageCircle } from 'lucide-react';
import { showChatNotification } from '@/utils/notifications';

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  isHost?: boolean;
}

interface PartyChatProps {
  partyId: string;
  partyName: string;
  members: Array<{
    id: string;
    name: string;
    level: number;
    job: string;
    joinedAt: number;
    isHost?: boolean;
  }>;
  onClose: () => void;
}

export function PartyChat({ partyId, partyName, members, onClose }: PartyChatProps) {
  const { profile } = usePlayerSession();
  const { t } = useLanguage();
  const { connect, disconnect, isConnected, sendChatMessage, joinPartyChat, leavePartyChat, sendTyping, on, off } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  // const [onlineUsers, setOnlineUsers] = useState<string[]>([]); // Future use
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connect to WebSocket and join party chat
  useEffect(() => {
    if (!profile) return;

    // Connect to WebSocket
    connect();

    return () => {
      if (profile) {
        leavePartyChat(partyId, profile.name);
      }
      disconnect();
    };
  }, [partyId, profile, connect, disconnect, leavePartyChat]);

  // Setup WebSocket event listeners
  useEffect(() => {
    if (!isConnected || !profile) return;

    // Join party chat room
    joinPartyChat(partyId, profile.name, profile.id);

    // Handle incoming chat messages
    const handleChatMessage = (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
      
      // Show notification if message is from another user and window is not focused
      if (message.playerId !== profile.id && document.hidden) {
        showChatNotification(message.playerName, message.message, partyName);
      }
    };

    // Handle user joined chat
    const handleUserJoined = (data: { playerName: string; playerId: string; timestamp: number }) => {
      const systemMessage: ChatMessage = {
        id: `join_${data.timestamp}`,
        playerId: 'system',
        playerName: 'System',
        message: `${data.playerName} joined the chat! 🎉`,
        timestamp: data.timestamp,
      };
      setMessages(prev => [...prev, systemMessage]);
    };

    // Handle user left chat
    const handleUserLeft = (data: { playerName: string; timestamp: number }) => {
      const systemMessage: ChatMessage = {
        id: `leave_${data.timestamp}`,
        playerId: 'system',
        playerName: 'System',
        message: `${data.playerName} left the chat 👋`,
        timestamp: data.timestamp,
      };
      setMessages(prev => [...prev, systemMessage]);
    };

    // Handle typing indicators
    const handleUserTyping = (data: { playerName: string; isTyping: boolean }) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(u => u !== data.playerName), data.playerName]);
      } else {
        setTypingUsers(prev => prev.filter(u => u !== data.playerName));
      }
    };

    // Register event listeners
    on('chatMessage', handleChatMessage);
    on('userJoinedChat', handleUserJoined);
    on('userLeftChat', handleUserLeft);
    on('userTyping', handleUserTyping);

    return () => {
      off('chatMessage', handleChatMessage);
      off('userJoinedChat', handleUserJoined);
      off('userLeftChat', handleUserLeft);
      off('userTyping', handleUserTyping);
    };
  }, [isConnected, partyId, profile, partyName, joinPartyChat, on, off]);

  // Load initial messages from localStorage as fallback
  useEffect(() => {
    const storedMessages = localStorage.getItem(`party_chat_${partyId}`);
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages);
        setMessages(prev => prev.length === 0 ? parsed : prev);
      } catch (error) {
        console.error('Error loading chat messages:', error);
      }
    }
  }, [partyId]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`party_chat_${partyId}`, JSON.stringify(messages));
    }
  }, [messages, partyId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !profile) return;

    const isHost = members.find(m => m.id === profile.id)?.isHost || false;

    if (isConnected) {
      // Send via WebSocket
      sendChatMessage(partyId, newMessage.trim(), profile.name, profile.id, isHost);
    } else {
      // Fallback to local storage
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        playerId: profile.id,
        playerName: profile.name,
        message: newMessage.trim(),
        timestamp: Date.now(),
        isHost,
      };
      setMessages(prev => [...prev, message]);
    }

    setNewMessage('');
    
    // Stop typing indicator
    if (isConnected && profile) {
      sendTyping(partyId, profile.name, false);
    }
  };

  // Handle typing indicators
  const handleInputChange = (value: string) => {
    setNewMessage(value);

    if (!isConnected || !profile) return;

    // Send typing indicator
    sendTyping(partyId, profile.name, true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(partyId, profile.name, false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStyle = (msg: ChatMessage) => {
    if (msg.playerId === 'system') {
      return 'bg-gray-100 text-gray-600 text-center text-sm italic';
    }
    if (msg.playerId === profile?.id) {
      return 'bg-maple-blue text-white ml-8';
    }
    return 'bg-white border border-gray-200 mr-8';
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-maple-blue text-white px-4 py-2 rounded-lg shadow-lg hover:bg-maple-blue/90 transition-all flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Party Chat
          {messages.length > 0 && (
            <span className="bg-white text-maple-blue rounded-full w-6 h-6 text-xs flex items-center justify-center">
              {messages.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-maple-blue text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <div>
            <h3 className="font-bold text-sm">{partyName}</h3>
            <p className="text-xs opacity-90 flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <Users className="w-3 h-3" />
              {members.length} members {isConnected ? 'online' : 'offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white/80 hover:text-white text-sm"
          >
            −
          </button>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Members List (collapsible) */}
      <div className="bg-gray-50 px-4 py-2 border-b">
        <div className="flex flex-wrap gap-2">
          {members.slice(0, 3).map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-full"
            >
              {member.isHost && <Crown className="w-3 h-3 text-yellow-500" />}
              <span className="text-gray-700">{member.name}</span>
              <span className="text-gray-500">Lv.{member.level}</span>
            </div>
          ))}
          {members.length > 3 && (
            <div className="text-xs text-gray-500 px-2 py-1">
              +{members.length - 3} more
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${getMessageStyle(msg)}`}
            >
              {msg.playerId !== 'system' && msg.playerId !== profile?.id && (
                <div className="flex items-center gap-2 mb-1">
                  {msg.isHost && <Crown className="w-3 h-3 text-yellow-500" />}
                  <span className="text-xs font-semibold text-gray-600">
                    {msg.playerName}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              )}
              {msg.playerId === profile?.id && (
                <div className="text-right mb-1">
                  <span className="text-xs text-white/70">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicators */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 border-t bg-gray-100">
          <p className="text-xs text-gray-500 italic">
            {typingUsers.length === 1 
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.slice(0, 2).join(', ')}${typingUsers.length > 2 ? ` and ${typingUsers.length - 2} others` : ''} are typing...`
            }
          </p>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message... (Press Enter to send)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-maple-blue focus:border-transparent text-sm"
            rows={2}
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-maple-blue text-white rounded-lg hover:bg-maple-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {newMessage.length}/500 characters
        </div>
      </div>
    </div>
  );
}
