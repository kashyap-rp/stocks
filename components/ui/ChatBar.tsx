import React, { useState } from 'react';
import axios from 'axios';

const ChatBar: React.FC = () => {
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
          prompt: input,
          max_tokens: 60
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          }

        const ticker = response.data.choices[0].text.trim();
        // Fetch the sector performance data for the given ticker
        // and update the sector performance component
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-transparent p-2">
      <input
        type="text"
        className="w-full px-3 py-2 rounded-md"
        placeholder="Talk to any stock..."
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatBar;