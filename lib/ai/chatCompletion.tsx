"use client"

import axios from "axios"
import { Message } from "@/lib/ai/openai"

export default async function streamChatCompletion({
  input,
  onStart,
  onUpdate,
  onCompletion,
}: {
  input: Message[] | string
  onStart: (initialConversation: Message[]) => void
  onUpdate: (
    nextToken: string,
    currentCompletion: string,
    currentConversation: Message[]
  ) => void
  onCompletion: (completion: string, finalConversation: Message[]) => void
}) {
  let inputMessages: Message[]
  if (typeof input === "string") {
    inputMessages = [{ role: "system", content: input }]
  } else {
    inputMessages = input
  }

  onStart(inputMessages)

  let outputMessage = ""

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      // prompt: inputMessages.map((msg) => msg.content).join("\n"),
      // max_tokens: 60,
      // stream: true,
      "model": "gpt-4o",
      "messages": [{ role: "user", content: input }],
      "temperature": 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_KEY}`,
      },
    }
  )
  console.log("response.data", response.data)
  // response.data.on("data", (chunk: any) => {
  //   console.log("chunk", chunk)
  //   const { choices } = JSON.parse(chunk.toString())
    
  // })

  // response.data.on("end", () => {
  //   onCompletion(
  //     outputMessage,
  //     inputMessages.concat([{ role: "assistant", content: outputMessage }])
  //   )
  // })
  const { choices } = response.data;
  if (choices && choices.length > 0) {
    const delta = choices[0].message
    outputMessage += delta.content
    onUpdate(
      delta.content,
      outputMessage,
      inputMessages.concat([{ role: "assistant", content: outputMessage }])
    )
    onCompletion(
      outputMessage,
      inputMessages.concat([{ role: "assistant", content: outputMessage }])
    )
  }
}
