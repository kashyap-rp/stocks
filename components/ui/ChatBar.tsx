import * as React from "react";
import axios from 'axios';

const ChatBar = () => {
  const [input, setInput] = React.useState('');

  const handleKeyPress = async (event) => {
    // Correctly check for the 'Enter' key press
    if(event.key === 'Enter'){
      const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: input,
        max_tokens: 60
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
        }
      });
      console.log(response.data.choices[0].text);
    }
  }
  

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-transparent p-2">
      <input
        type="text"
        className="w-full px-3 py-2 rounded-md"
        placeholder="Talk to any stock..."
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatBar;