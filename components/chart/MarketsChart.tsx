import { fetchChartData } from "@/lib/alpha-finance/fetchChartData"
import { Interval } from "@/types/alpha-vantage"
import AreaClosedChart from "./AreaClosedChart"
import { fetchQuote } from "@/lib/alpha-finance/fetchQuote"
import { useEffect, useState } from "react"

export default function MarketsChart({
  ticker,
  range,
  interval,
}: {
  ticker: string
  range: string
  interval: Interval
}) {
  const [chart, setChartData] = useState<any>([])
  const [quote, setQuoteData] = useState<any>({})
  const [stockQuotes, setStockQuotesData] = useState<any>([])
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    console.log("*******--1--******")
    async function fetchChartQuotes() {
      console.log("*******--2--******", ticker, range, interval)
      const chartDataPromise = await fetchChartData(ticker, range, interval)
      const quoteDataPromise = await fetchQuote(ticker)
      console.log("*******--51--******", chartDataPromise)
      console.log("*******--5--******", quoteDataPromise)
      setChartData(chartDataPromise)
      setQuoteData(quoteDataPromise)

      const stockQuotes = chartDataPromise.quotes
        ? chartDataPromise.quotes
            .map((quote) => ({
              date: quote.date,
              close: quote.close?.toFixed(2),
            }))
            .filter((quote) => quote.close !== undefined && quote.date !== null)
        : []
      setStockQuotesData(stockQuotes)
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }
    setLoading(true)
    fetchChartQuotes()
  }, [range])

  try {
    return (
      <>
        {/* {JSON.stringify(quote)} */}
        {Object.keys(quote).length > 0 && (
          <div className="mb-0.5 font-medium">
            {quote.shortName} ({quote.symbol}){" "}
            {quote.regularMarketPrice?.toLocaleString(undefined, {
              style: "currency",
              currency: quote.currency,
            })}
          </div>
        )}
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-center text-neutral-500">
            Loading
          </div>
        ) : Object.keys(chart).length > 0 &&
          chart?.quotes &&
          chart?.quotes?.length > 0 ? (
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
