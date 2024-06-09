export interface SectorStats {
  sector: string
  changesPercentage: string
  currentPrice?: number // Optional property for current price
  historicalData?: any[] // Optional property for historical data
}

export interface Trade {
  entryTimestamp: string
  entryPrice: number
  exitTimestamp: string
  exitPrice: number
}
export interface OptionCall {
  strikePrice: number
  premium: number
  currentPrice: number
  investmentAmount: number
}
export interface HistoricalDataPoint {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type HistoricalData = HistoricalDataPoint[]

// /**from yahoo-finance2/dist/src/modules/historical.ts (couldn't get it to import; idk why) */
// export interface HistoricalRowHistory {
//   [key: string]: any
//   date: Date
//   open: number
//   high: number
//   low: number
//   close: number
//   adjClose?: number
//   volume: number
// }
