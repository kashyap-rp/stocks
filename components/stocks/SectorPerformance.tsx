import React from "react"
import { calculateOptionCallROI } from "@/lib/alpha-finance/optionalCallROI"
import Message from "@/lib/ai/chatCompletion"
import { calculateROI } from "@/lib/alpha-finance/roi"
import { OptionCall, QuoteWithTitle, Trade } from "@/types"


export default async function SectorPerformance(sectorData: QuoteWithTitle, trade: Trade, userProvidedStrikePrice: number, calculatedPremium: number) {
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

  return (
    <Message 
      input="Your AI response here..."
      onStart={(initialConversation) => {
        console.log('Conversation started:', initialConversation);
      }}
      onUpdate={(nextToken, currentCompletion, currentConversation) => {
        console.log('Conversation updated:', nextToken, currentCompletion, currentConversation);
      }}
      onCompletion={(completion, finalConversation) => {
        console.log('Conversation completed:', completion, finalConversation);
      }}
    />
  )
}
