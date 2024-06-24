"use client"

import React from "react"
import axios from "axios"
import streamChatCompletion from "@/lib/ai/chatCompletion"

import { InputText } from 'primereact/inputtext';
        

const ChatBar = (props: any) => {
  const [input, setInput] = React.useState("")

  const handleKeyPress = async (event: { key: string }) => {
    // Correctly check for the 'Enter' key press
    console.log("handleKeyPress", event)
    if (event.key === "Enter") {
      streamChatCompletion({
        input: input,
        onStart: (initialConversation) => {
          console.log("Starting chat...", initialConversation)
        },
        onUpdate: (nextToken, currentCompletion, currentConversation) => {
          // setInput(currentCompletion)
        },
        onCompletion: (completion, finalConversation) => {
          console.log(completion, finalConversation)
          props?.onMessageComplete(completion)
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
        // value={input}
        onChange={(e) => setInput(e.target.value)}
        // onKeyPress={handleKeyPress}
        // onKeyDown={handleKeyPress}
        onKeyUp={(e) => {
          console.log("onKeyUp", e);
          handleKeyPress(e);
        }}
      />
      {/* <InputText value={'What is the return on investment on tesla and apple if I buy $10 worth of stock on 20 June 2024'}  onKeyUp={(e) => {
          console.log("onKeyUp", e);
          handleKeyPress(e);
        }} onChange={(e) => console.log("e", e)}  /> */}
    </div>
  )
}

export default ChatBar
