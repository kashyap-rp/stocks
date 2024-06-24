// 'use client'
import StockChart from "@/components/chart/StockChart"
import CompanySummaryCard from "@/app/stocks/[ticker]/components/CompanySummaryCard"
import FinanceSummary from "@/app/stocks/[ticker]/components/FinanceSummary"
import News from "@/app/stocks/[ticker]/components/News"
import { Card, CardContent } from "@/components/ui/card"
import {
  DEFAULT_FREQUENCY,
  DEFAULT_TIME_PERIOD,
} from "@/lib/alpha-finance/constants"
import {
  validateInterval,
  validateTimePeriod,
} from "@/lib/alpha-finance/fetchChartData"
import { Interval } from "@/types/alpha-vantage"
import { Suspense } from "react"
import type { Metadata } from "next"
import { fetchQuote } from "@/lib/alpha-finance/fetchQuote"

type Props = {
  params: {
    ticker: string
  }
  searchParams?: {
    ticker?: string
    timePeriod?: string
    interval?: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ticker = params.ticker

  const quoteData = await fetchQuote(ticker)
  const regularMarketPrice = quoteData.regularMarketPrice?.toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  )

  return {
    title: `${ticker} ${regularMarketPrice}`,
    description: `Stocks page for ${ticker}`,
    keywords: [ticker, "stocks"],
  }
}

export default async function StocksPage({ params, searchParams }: Props) {
  const ticker = params.ticker
  const timePeriod = validateTimePeriod(
    searchParams?.timePeriod || DEFAULT_TIME_PERIOD
  )
  const interval = validateInterval(
    timePeriod,
    (searchParams?.interval as Interval) || DEFAULT_FREQUENCY
  )

  return (
    <div>
      <Card>
        <CardContent className="space-y-10 pt-6 lg:px-40 lg:py-14">
          <Suspense
            fallback={
              <div className="flex h-[27.5rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <StockChart
              ticker={ticker}
              timePeriod={timePeriod}
              interval={interval}
            />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex h-[10rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <FinanceSummary ticker={ticker} />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex h-[10rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <CompanySummaryCard ticker={ticker} />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex h-[20rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <News ticker={ticker} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
