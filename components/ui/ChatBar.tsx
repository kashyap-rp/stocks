"use client"

import React from "react"
import axios from "axios"

const ChatBar = () => {
  const [input, setInput] = React.useState("")

  const handleKeyPress = async (event: { key: string }) => {
    // Correctly check for the 'Enter' key press
    if (event.key === "Enter") {
      streamChatCompletion({
        input: input,
        onStart: () => {
          console.log("Starting chat...")
        },
        onUpdate: (text: string, nextToken: string) => {
          setInput(text)
        },
        onCompletion: (completion: string) => {
          console.log(completion)
        },
      })
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-transparent p-2">
      <input
        type="text"
        className="w-full rounded-md px-3 py-2"
        placeholder="Talk to any stock..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  )
}

export default ChatBar
