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
      onStart={(initialConversation) => {/* handle start */}}
      onUpdate={(nextToken, currentCompletion, currentConversation) => {/* handle update */}}
      onCompletion={(completion, finalConversation) => {/* handle completion */}}
    />
  )
}
