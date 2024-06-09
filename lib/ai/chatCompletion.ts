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
  let content: Message[]
  if (typeof input === "string") {
    content = [{ role: "system", content: input }]
  } else {
    content = input
  }

  onStart(content)

  const response = await axios.post(
    "https://api.openai.com/v1/engines/gpt-4-xxxx/chat",
    {
      prompt: content.map((msg) => msg.content).join("\n"),
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
      const nextPart = choices[0].text
      content.push({ role: "system", content: nextPart })
      onUpdate(nextPart, nextPart, content)
    }
  })

  response.data.on("end", () => {
    const finalOutput = content.map((msg) => msg.content).join("")
    onCompletion(finalOutput, content)
  })
}
