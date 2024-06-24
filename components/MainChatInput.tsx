// ParentComponent.tsx
"use client"
import React from 'react';
import ChatBarUI from './ui/ChatBar';

interface ChatBarProps {
  onMessageComplete: (message: string) => void;
}

const ChatBar: React.FC<ChatBarProps> = ({ onMessageComplete }) => {
  // Your component logic here
  // Use onMessageComplete(message) to pass the message back to the parent component
  return <ChatBarUI onMessageComplete={onMessageComplete} />;
};

export default ChatBar;