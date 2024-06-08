export type AlphaVantageFunction =
  | "TIME_SERIES_INTRADAY"
  | "TIME_SERIES_DAILY"
  | "TIME_SERIES_DAILY_ADJUSTED"
  | "TIME_SERIES_WEEKLY"
  | "TIME_SERIES_WEEKLY_ADJUSTED"
  | "TIME_SERIES_MONTHLY"
  | "TIME_SERIES_MONTHLY_ADJUSTED"
  | "GLOBAL_QUOTE"
  | "SYMBOL_SEARCH";

export type Interval =
  | "1min"
  | "5min"
  | "15min"
  | "30min"
  | "60min"
  | "daily"
  | "weekly"
  | "monthly";

export type OutputSize = "compact" | "full";
