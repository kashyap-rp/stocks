import * as React from "react";
import axios from 'axios';

const ChatBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-transparent p-2">
      <input
        type="text"
        className="w-full px-3 py-2 rounded-md"
        placeholder="Talk to any stock..."
      />
    </div>
  );
};

export default ChatBar;