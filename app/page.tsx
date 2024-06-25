"use client"
import { DataTable } from "@/components/stocks/markets/data-table"
import yahooFinance from "yahoo-finance2"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DEFAULT_FREQUENCY,
  DEFAULT_TIME_PERIOD,
  FREQUENCIES_FOR_TIME_PERIOD,
  VALID_TIME_PERIODS,
} from "@/lib/alpha-finance/constants"
import { Interval } from "@/types/alpha-vantage"
import { Suspense, use, useEffect, useState } from "react"
import MarketsChart from "@/components/chart/MarketsChart"
import Link from "next/link"
import { columns } from "@/components/stocks/markets/columns"
import SectorPerformance from "@/components/stocks/RateOfReturn"
// import {
//   validateInterval,
//   validateTimePeriod,
// } from "@/lib/alpha-finance/fetchChartData"
import { fetchStockSearch } from "@/lib/alpha-finance/fetchStockSearch"
import { fetchStockSearch2 } from "@/lib/alpha-finance/fetchStockSearch2"
import { Quote, QuoteWithTitle, Trade } from "@/types"
import ChatBar from "@/components/MainChatInput"

function isMarketOpen() {
  const now = new Date()

  // Convert to New York time
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }
  const formatter = new Intl.DateTimeFormat([], options)
  const timeString = formatter.format(now)
  const [hour, minute] = timeString.split(":").map(Number)
  const timeInET = hour + minute / 60

  // Get the day of the week in New York time
  const dayInET = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  ).getDay()

  // Check if the current time is between 9:30 AM and 4:00 PM ET on a weekday
  if (dayInET >= 1 && dayInET <= 5 && timeInET >= 9.5 && timeInET < 16) {
    return true
  } else {
    return false
  }
}

const tickersFutures = [
  { symbol: "ES=F", shortName: "S&P 500 Futures" },
  { symbol: "NQ=F", shortName: "NASDAQ Futures" },
  { symbol: "YM=F", shortName: "Dow Jones Futures" },
  { symbol: "RTY=F", shortName: "Russell 2000 Futures" },
  { symbol: "CL=F", shortName: "Crude Oil" },
  { symbol: "GC=F", shortName: "Gold" },
  { symbol: "SI=F", shortName: "Silver" },
  { symbol: "EURUSD=X", shortName: "EUR/USD" },
  { symbol: "^TNX", shortName: "10 Year Bond" },
  { symbol: "BTC-USD", shortName: "Bitcoin" },
]

const tickerAfterOpen = [
  { symbol: "^GSPC", shortName: "S&P 500" },
  { symbol: "^IXIC", shortName: "NASDAQ" },
  { symbol: "^DJI", shortName: "Dow Jones" },
  { symbol: "^RUT", shortName: "Russell 2000" },
  { symbol: "CL=F", shortName: "Crude Oil" },
  { symbol: "GC=F", shortName: "Gold" },
  { symbol: "SI=F", shortName: "Silver" },
  { symbol: "EURUSD=X", shortName: "EUR/USD" },
  { symbol: "^TNX", shortName: "10 Year Bond" },
  { symbol: "BTC-USD", shortName: "Bitcoin" },
]

function getMarketSentiment(changePercentage: number | undefined) {
  if (changePercentage === undefined) {
    return "neutral"
  }
  if (changePercentage > 0.1) {
    return "bullish"
  } else if (changePercentage < -0.1) {
    return "bearish"
  } else {
    return "neutral"
  }
}

const validateTimePeriod = (range: string): string =>
  VALID_TIME_PERIODS.includes(range) ? range : DEFAULT_TIME_PERIOD

const validateInterval = (range: string, interval: Interval): Interval =>
  FREQUENCIES_FOR_TIME_PERIOD[range].includes(interval)
    ? interval
    : FREQUENCIES_FOR_TIME_PERIOD[range][0]

export default function Home({
  searchParams,
}: {
  searchParams?: {
    ticker?: string
    range?: string
    interval?: string
  }
}) {
  console.log("++++++++++++++=", searchParams, DEFAULT_FREQUENCY)
  const tickers = isMarketOpen() ? tickerAfterOpen : tickersFutures

  const ticker = searchParams?.ticker || tickers[0].symbol
  const range = validateTimePeriod(searchParams?.range || DEFAULT_TIME_PERIOD)
  console.log("++++++Range", range)
  const interval = validateInterval(
    range,
    (searchParams?.interval as Interval) || DEFAULT_FREQUENCY
  )
  console.log("++++++interval", interval)
  // let news = {}
  const [news, setNews] = useState<any>({})
  const [promiseResult, setPromiseResults] = useState<any>([])
  const [resultsWithTitles, setResultsWithTitles] = useState<any>([])
  const [marketSentiment, setMarketSentiment] = useState<String>("neutral")
  const [sentimentColor, setSentimentColor] =
    useState<String>("text-neutral-500")
  const [sentimentBackground, setSentimentBackground] =
    useState<String>("bg-neutral-500/10")
  const [chatMessage, setChatMessage] = useState<String>("")

  useEffect(() => {
    // console.log("useEffect")
    async function fetchYahooFinanceTickers() {
      const _news1 = await fetchStockSearch("^DJI", 1)
      // console.log("_news", _news1)
      setNews(_news1)
    }
    fetchYahooFinanceTickers()
  }, [])

  useEffect(() => {
    // console.log("useEffect")
    async function fetchYahooQuoteCombine() {
      // console.log("====1===")
      // console.log("====2===")
      const _promiseResult = await fetchStockSearch2(tickers)
      // console.log("====3===", _promiseResult)
      setPromiseResults(_promiseResult)

      const _resultsWithTitles: QuoteWithTitle[] = _promiseResult.map(
        (result, index) => ({
          ...result,
          shortName: tickers[index].shortName,
        })
      )
      setResultsWithTitles(_resultsWithTitles)

      const _marketSentiment = getMarketSentiment(
        _resultsWithTitles[0].regularMarketChangePercent
      )

      setMarketSentiment(_marketSentiment)

      const _sentimentColor =
        _marketSentiment === "bullish"
          ? "text-green-500"
          : _marketSentiment === "bearish"
            ? "text-red-500"
            : "text-neutral-500"
      setSentimentColor(_sentimentColor)

      const _sentimentBackground =
        _marketSentiment === "bullish"
          ? "bg-green-500/10"
          : _marketSentiment === "bearish"
            ? "bg-red-300/50 dark:bg-red-950/50"
            : "bg-neutral-500/10"
      setSentimentBackground(_sentimentBackground)
    }
    fetchYahooQuoteCombine()
  }, [])

  // function setChatMessage(message: string): void {
  //   // throw new Error("Function not implemented.")
  //   console.error("Function not implemented")
  // }

  const getNews = () => {
    // console.log("~~>News", news);
    if (Object.keys(news).length > 0) {
      if (news.news[0] && news.news[0].title) {
        return (
          <CardFooter className="flex-col items-start">
            <p className="mb-2 text-sm font-semibold text-neutral-500 dark:text-neutral-500">
              What you need to know today
            </p>
            <Link
              prefetch={false}
              href={news.news[0].link}
              className="text-lg font-extrabold"
            >
              {news.news[0].title}
            </Link>
          </CardFooter>
        )
      } else {
        return <></>
      }
    } else {
      return <></>
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ChatBar
        onMessageComplete={(v: any) => {
          setChatMessage(v)
        }}
      />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <Card className="relative flex h-full min-h-[15rem] flex-col justify-between overflow-hidden">
            <CardHeader>
              <CardTitle className="z-50 w-fit rounded-full px-4  py-2 font-medium dark:bg-neutral-100/5">
                The markets are{" "}
                <strong className={sentimentColor}>{marketSentiment}</strong>
              </CardTitle>
            </CardHeader>
            {Object.keys(news).length > 0 && getNews()}
            <div
              className={`pointer-events-none absolute inset-0 z-0 h-[65%] w-[65%] -translate-x-[10%] -translate-y-[30%] rounded-full blur-3xl ${sentimentBackground}`}
            />
          </Card>
        </div>
        <div className="w-full lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle className="text-white-500 text-lg">
                Rate of Return (%)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                {resultsWithTitles.length > 0 && (
                  <>
                    <SectorPerformance
                      sectorData={resultsWithTitles[0]}
                      trade={undefined as unknown as Trade}
                      userProvidedStrikePrice={0}
                      calculatedPremium={0}
                      chatMessage={chatMessage}
                    />
                  </>
                )}
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
        <h2 className="py-4 text-xl font-medium">Markets</h2>
        <Card className="flex flex-col gap-4 p-6 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<div>Loading...</div>}>
              <DataTable columns={columns} data={resultsWithTitles} />
            </Suspense>
          </div>
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<div>Loading...</div>}>
              <MarketsChart
                ticker={ticker}
                range={range as string}
                interval={interval}
              />
            </Suspense>
          </div>
        </Card>
      </div>
    </div>
  )
}
