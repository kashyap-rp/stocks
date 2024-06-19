import { fetchChartData } from "@/lib/alpha-finance/fetchChartData"
import { Interval } from "@/types/alpha-vantage"
import AreaClosedChart from "./AreaClosedChart"
import { fetchQuote } from "@/lib/alpha-finance/fetchQuote"

export default async function MarketsChart({
  ticker,
  range,
  interval,
}: {
  ticker: string
  range: string
  interval: Interval
}) {
  try {
    const chartDataPromise = fetchChartData(ticker, range, interval)
    const quoteDataPromise = fetchQuote(ticker)

    const [chart, quote] = await Promise.all([chartDataPromise, quoteDataPromise])

    const stockQuotes = chart.quotes
      ? chart.quotes
          .map((quote) => ({
            date: quote.date,
            close: quote.close?.toFixed(2),
          }))
          .filter((quote) => quote.close !== undefined && quote.date !== null)
      : []

    return (
      <>
        <div className="mb-0.5 font-medium">
          {quote.shortName} ({quote.symbol}){" "}
          {quote.regularMarketPrice?.toLocaleString(undefined, {
            style: "currency",
            currency: quote.currency,
          })}
        </div>
        {chart.quotes && chart.quotes.length > 0 ? (
          <AreaClosedChart chartQuotes={stockQuotes} range={range} />
        ) : (
          <div className="flex h-full items-center justify-center text-center text-neutral-500">
            No data available
          </div>
        )}
      </>
    )
  } catch (error) {
    console.error("Error fetching market data:", error)
    return (
      <div className="flex h-full items-center justify-center text-center text-neutral-500">
        Error loading data
      </div>
    )
  }
}
