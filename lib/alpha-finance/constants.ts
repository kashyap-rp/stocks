import type { Interval } from "@/types/alpha-vantage"

export const DEFAULT_SYMBOL = "AAPL"
export const DEFAULT_TIME_PERIOD = "1d"
export const DEFAULT_FREQUENCY = "1min"
export const DEFAULT_SCREEN = "most_actives"

export const VALID_TIME_PERIODS: string[] = ["1d", "1w", "1m", "3m", "1y"]
export const FREQUENCIES_FOR_TIME_PERIOD: { [key: string]: Interval[] } = {
  "1d": ["1min", "5min", "15min", "30min", "60min"],
  "1w": ["daily", "weekly"],
  "1m": ["daily", "weekly", "monthly"],
  "3m": ["daily", "weekly", "monthly"],
  "1y": ["daily", "weekly", "monthly"],
}
