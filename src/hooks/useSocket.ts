'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  autoConnect?: boolean;
  serverUrl?: string;
}

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  isHost?: boolean;
}

interface SocketEvents {
  chatMessage: (message: ChatMessage) => void;
  userJoinedChat: (data: { playerName: string; playerId: string; timestamp: number }) => void;
  userLeftChat: (data: { playerName: string; timestamp: number }) => void;
  userTyping: (data: { playerName: string; isTyping: boolean }) => void;
  partyUpdated: (data: { action: string; data: any; timestamp: number }) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { autoConnect = false, serverUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002' } = options;
  
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = () => {
    if (socketRef.current?.connected) return;
    
    setIsConnecting(true);
    setError(null);

    socketRef.current = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true,
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 Connected to WebSocket server');
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from WebSocket server:', reason);
      setIsConnected(false);
      setIsConnecting(false);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('🔌 WebSocket connection error:', err);
      setError(err.message);
      setIsConnected(false);
      setIsConnecting(false);
    });
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setIsConnecting(false);
    }
  };

  // Party Chat Methods
  const joinPartyChat = (partyId: string, playerName: string, playerId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('joinPartyChat', { partyId, playerName, playerId });
    }
  };

  const leavePartyChat = (partyId: string, playerName: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leavePartyChat', { partyId, playerName });
    }
  };

  const sendChatMessage = (partyId: string, message: string, playerName: string, playerId: string, isHost?: boolean) => {
    if (socketRef.current?.connected && message.trim()) {
      socketRef.current.emit('sendChatMessage', {
        partyId,
        message: message.trim(),
        playerName,
        playerId,
        isHost
      });
    }
  };

  const sendTyping = (partyId: string, playerName: string, isTyping: boolean) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', { partyId, playerName, isTyping });
    }
  };

  const joinServer = (serverName: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('joinServer', serverName);
    }
  };

  // Event listeners
  const on = <K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) => {
    if (socketRef.current) {
      socketRef.current.on(event as string, callback);
    }
  };

  const off = <K extends keyof SocketEvents>(event: K, callback?: SocketEvents[K]) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event as string, callback);
      } else {
        socketRef.current.off(event as string);
      }
    }
  };

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, serverUrl]);

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    joinPartyChat,
    leavePartyChat,
    sendChatMessage,
    sendTyping,
    joinServer,
    on,
    off,
  };
}
