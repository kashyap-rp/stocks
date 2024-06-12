import React, { useEffect, useState } from "react"
import { calculateOptionCallROI } from "@/lib/alpha-finance/optionalCallROI"
import streamChatCompletion from "@/lib/ai/chatCompletion"
import { calculateROI } from "@/lib/alpha-finance/roi"
import { OptionCall, QuoteWithTitle, Trade } from "@/types"

export default function SectorPerformance({ sectorData, trade, userProvidedStrikePrice, calculatedPremium }: { sectorData: QuoteWithTitle, trade: Trade, userProvidedStrikePrice: number, calculatedPremium: number }) {
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    const roi = calculateROI(sectorData.historicalDataPoint, trade)

    const bestCaseCurrentOptionalCall: OptionCall = {
      strikePrice: sectorData.strikePrice || userProvidedStrikePrice,
      premium: sectorData.premium || calculatedPremium,
      currentPrice: sectorData.lastMarket,
      investmentAmount:
        sectorData.investmentAmount ||
        sectorData.numContracts * sectorData.premium,
    }

    const optionalCallRoi = calculateOptionCallROI(bestCaseCurrentOptionalCall)

    streamChatCompletion({
      input: "Your AI response here...",
      onStart: (initialConversation) => {
        console.log('Conversation started:', initialConversation);
      },
      onUpdate: (nextToken, currentCompletion, currentConversation) => {
        console.log('Conversation updated:', nextToken, currentCompletion, currentConversation);
      },
      onCompletion: (completion, finalConversation) => {
        console.log('Conversation completed:', completion, finalConversation);
        setMessage(completion);
      },
    })
  }, [sectorData, trade, userProvidedStrikePrice, calculatedPremium]);

  return (
    <div>{message}</div>
  )
}
