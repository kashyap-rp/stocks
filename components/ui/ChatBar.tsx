"use client"

import React, { useState } from "react"
import axios from "axios"
import streamChatCompletion from "@/lib/ai/chatCompletion"
import { Triangle } from "react-loader-spinner"
import { InputText } from "primereact/inputtext"
import { useTheme } from "next-themes"

const ChatBar = (props: any) => {
  const [input, setInput] = React.useState("")
  const [finalConversation, setFinalConversation]: any = React.useState([])
  const [enter, setEnter] = React.useState(false)
  const { theme } = useTheme()
  const handleKeyPress = async (event: { key: string }) => {
    // Correctly check for the 'Enter' key press
    console.log("handleKeyPress", event)
    if (event.key === "Enter") {
      setEnter(true)
      streamChatCompletion({
        input: input,
        onStart: (initialConversation) => {
          console.log("Starting chat...", initialConversation)
        },
        onUpdate: (nextToken, currentCompletion, currentConversation) => {
          // setInput(currentCompletion)
        },
        onCompletion: (completion, finalConversation) => {
          console.log(
            "completion",
            completion,
            "finalConversation",
            finalConversation
          )
          setFinalConversation(finalConversation)
          setInput("")
          props?.onMessageComplete(completion)
        },
      })
    }
  }

  return (
    // <div className="fixed bottom-0 left-0 right-0 bg-transparent p-2">
    <div className="fixed bottom-0 left-0 right-0 bg-background p-2 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="relative">
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
            console.log("onKeyUp", e)
            handleKeyPress(e)
          }}
        />
        {enter && finalConversation?.length == 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
            <Triangle
              visible={true}
              height="30"
              width="30"
              color={theme == "light" ? "#34495E" : "#F2F3F4"}
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}
      </div>

      {/* <InputText value={'What is the return on investment on tesla and apple if I buy $10 worth of stock on 20 June 2024'}  onKeyUp={(e) => {
          console.log("onKeyUp", e);
          handleKeyPress(e);
        }} onChange={(e) => console.log("e", e)}  /> */}
    </div>
  )
}

export default ChatBar
