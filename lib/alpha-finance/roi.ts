import { HistoricalDataPoint, Trade } from "@/types"

export const calculateROI = async (
  historicalData: HistoricalDataPoint[],
  trade: Trade
): Promise<number> => {
  // Assuming historicalData is sorted by timestamp
  const entryIndex = historicalData.findIndex(
    (point) => point.timestamp === trade.entryTimestamp
  )
  const exitIndex = historicalData.findIndex(
    (point) => point.timestamp === trade.exitTimestamp
  )

  if (entryIndex < 0 || exitIndex < 0) {
    throw new Error("Entry or exit timestamp not found in historical data")
  }

  const entryClosePrice = historicalData[entryIndex].close
  const exitClosePrice = historicalData[exitIndex].close

  const profit = exitClosePrice - entryClosePrice
  const roi = (profit / entryClosePrice) * 100

  return roi
}
