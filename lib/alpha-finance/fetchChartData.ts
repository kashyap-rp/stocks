'use server'
import { unstable_noStore as noStore } from "next/cache"
import type {
  ChartOptions,
  ChartResultArray,
} from "@/node_modules/yahoo-finance2/dist/esm/src/modules/chart"
import type { Interval } from "@/types/alpha-vantage"
import {
  DEFAULT_TIME_PERIOD,
  FREQUENCIES_FOR_TIME_PERIOD,
  VALID_TIME_PERIODS,
} from "./constants"
import { CalculateRange } from "@/lib/utils"
import yahooFinance from "yahoo-finance2"

export const validateTimePeriod = (range: string): string =>
  VALID_TIME_PERIODS.includes(range) ? range : DEFAULT_TIME_PERIOD

export const validateInterval = (
  range: string,
  interval: Interval
): Interval =>
  FREQUENCIES_FOR_TIME_PERIOD[range].includes(interval)
    ? interval
    : FREQUENCIES_FOR_TIME_PERIOD[range][0]

export async function fetchChartData(
  ticker: string,
  range: string,
  interval: Interval // TODO: interval is provided, but not used!
) {
  noStore()
  console.log("range>>", range)
  const queryOptions: ChartOptions = {
    period1: CalculateRange(range),
    // interval: interval,
  }
  console.log("*******--3--******", ticker, range, interval)
  try {
    const chartData: ChartResultArray = await yahooFinance.chart(
      ticker,
      queryOptions
    )
    console.log("*******--4--******", chartData)
    return chartData
  } catch (error) {
    console.log("*******--5--******", error)
    console.log("Failed to fetch chart data", error)
    throw new Error("Failed to fetch chart data.")
  }
}
