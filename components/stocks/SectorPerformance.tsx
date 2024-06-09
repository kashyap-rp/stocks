"use server"

import { cn } from "@/lib/utils"
import yahooFinance from "yahoo-finance2"
import { SectorStats, HistoricalRowHistory } from "@/types"
import { calculateROI } from "@/lib/alpha-finance/roi"
import { calculateOptionCallROI } from "@/lib/alpha-finance/optionalCallROI"

async function fetchSectorPerformance(): Promise<SectorStats[]> {
  try {
    const API_KEY = process.env.ALPHA_VANTAGE_KEY
    const res = await fetch(
      `https://www.alphavantage.co/query?function=SECTOR&apikey=${API_KEY}`
    )
    if (!res.ok) {
      console.error("Failed to fetch sector performance")
      return []
    }
    const data = await res.json()
    return Object.entries(data["Rank A: Real-Time Performance"] || {}).map(
      ([sector, changesPercentage]) => ({
        sector,
        changesPercentage: (
          parseFloat(changesPercentage as string) * 100
        ).toFixed(2),
        currentPrice: 0, // We're going to update later
        historicalData: [], // We're going to update later
      })
    )
  } catch (error) {
    console.error("Error fetching sector performance:", error)
    return []
  }
}

async function fetchHistoricalData(sector: string) {
  const query = sector.replace(/\s+/g, "") // Simplify sector name for query
  try {
    const historicalData: HistoricalRowHistory[] =
      await yahooFinance.historical(query, {
        period1: "2020-01-01",
        period2: "2023-01-01",
        interval: "1mo",
      })
    return historicalData
  } catch (error) {
    console.error("Error fetching historical data for sector:", sector, error)
    return []
  }
}

export default async function SectorPerformance() {
  let sectors = await fetchSectorPerformance()

  for (let sector of sectors) {
    const historicalData = await fetchHistoricalData(sector.sector)
    sector.historicalData = historicalData
    sector.currentPrice = historicalData[0]?.close || 0 // Assume the most recent close price is the current price TODO: IDK if index 0 gets the most recent or the first price
  }

  const rois = sectors.map((sector) => {
    if (!sector.historicalData?.length) return null
    const trade = {
      entryTimestamp:
        sector.historicalData[sector.historicalData.length - 1].date,
      exitTimestamp: sector.historicalData[0].date,
    }
    return calculateROI(sector.historicalData, trade)
  })

  const optionCallROIs = sectors.map((sector) => {
    if (!sector.currentPrice) return null
    const option = {
      strikePrice: sector.currentPrice * 0.95, // Example: strike price is 95% of current price
      premium: sector.currentPrice * 0.05, // Example: premium is 5% of current price
      currentPrice: sector.currentPrice,
      investmentAmount: 1000, // Example fixed investment amount
    }
    return calculateOptionCallROI(option)
  })

  if (!sectors.length) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {sectors.map((sector, index) => (
        <div
          key={sector.sector}
          className="flex w-full flex-row items-center justify-between text-sm"
        >
          <span className="font-medium">{sector.sector}</span>
          <span
            className={cn(
              "w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right transition-colors",
              parseFloat(sector.changesPercentage) > 0
                ? "bg-gradient-to-l from-green-300 text-green-800 dark:from-green-950 dark:text-green-400"
                : "bg-gradient-to-l from-red-300 text-red-800 dark:from-red-950 dark:text-red-500"
            )}
          >
            {sector.changesPercentage + "%"}
          </span>
          <span>
            {rois[index]
              ? `${rois[index].toFixed(2)}% ROI`
              : "ROI Data Unavailable"}
          </span>
          <span>
            {optionCallROIs[index]
              ? `${optionCallROIs[index].toFixed(2)}% Option ROI`
              : "Option ROI Data Unavailable"}
          </span>
        </div>
      ))}
    </div>
  )
}
