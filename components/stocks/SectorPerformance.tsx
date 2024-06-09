import { calculateOptionCallROI } from "@/lib/alpha-finance/optionalCallROI"
import { calculateROI } from "@/lib/alpha-finance/roi"
import { OptionCall, QuoteWithTitle } from "@/types"

export default async function SectorPerformance(sectorData: QuoteWithTitle) {
  const roi = calculateROI(sectorData.historicalDataPoint, trade)

  const bestCaseCurrentOptionalCall: OptionCall = {
    strikePrice: sectorData.strikePrice || userProvidedStrikePrice, // userProvidedStrikePrice needs to be defined or fetched
    premium: sectorData.premium || calculatedPremium, // calculatedPremium needs to be defined or calculated
    currentPrice: sectorData.lastMarket,
    investmentAmount:
      sectorData.investmentAmount ||
      sectorData.numContracts * sectorData.premium, // Assuming numContracts is available
  }

  const optionalCallRoi = calculateOptionCallROI(bestCaseCurrentOptionalCall)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">Hello world!</div>
  )
}
