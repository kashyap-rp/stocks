"use server"

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
    "https://api.openai.com/v1/engines/gpt-4o/chat",
    {
      prompt: inputMessages.map((msg) => msg.content).join("\n"),
      max_tokens: 60,
      stream: true,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
      },
    }
  )

  response.data.on("data", (chunk: any) => {
    const { choices } = JSON.parse(chunk.toString())
    if (choices && choices.length > 0) {
      // i don't know if this is correct, just try it and see what the right keys are
      const delta = choices[0].delta
      outputMessage += delta.content
      onUpdate(
        delta.content,
        outputMessage,
        inputMessages.concat([{ role: "assistant", content: outputMessage }])
      )
    }
  })

  response.data.on("end", () => {
    onCompletion(
      outputMessage,
      inputMessages.concat([{ role: "assistant", content: outputMessage }])
    )
  })
}
