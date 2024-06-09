interface HistoricalDataPoint {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface Trade {
  entryTimestamp: string
  entryPrice: number
  exitTimestamp: string
  exitPrice: number
}

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

// const historicalData: HistoricalDataPoint[] = [
//     {
//         timestamp: "2024-06-01",
//         open: 100,
//         high: 105,
//         low: 95,
//         close: 100,
//         volume: 1000,
//     },
//     // ... more data points
//     {
//         timestamp: "2024-06-08",
//         open: 105,
//         high: 110,
//         low: 100,
//         close: 105,
//         volume: 1000,
//     },
// ];

// const trade: Trade = {
//     entryTimestamp: "2024-06-01",
//     entryPrice: 100,
//     exitTimestamp: "2024-06-08",
//     exitPrice: 105,
// };

// calculateROI(historicalData, trade).then(roi => console.log(`ROI: ${roi.toFixed(2)}%`));
