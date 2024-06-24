'use client'
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
} from "@/lib/alpha-finance/constants"
import { Interval } from "@/types/alpha-vantage"
import { Suspense, useState } from "react"
import MarketsChart from "@/components/chart/MarketsChart"
import Link from "next/link"
import { columns } from "@/components/stocks/markets/columns"
import SectorPerformance from "@/components/stocks/RateOfReturn"
import {
  validateInterval,
  validateTimePeriod,
} from "@/lib/alpha-finance/fetchChartData"
import { fetchStockSearch } from "@/lib/alpha-finance/fetchStockSearch"
import { Quote, QuoteWithTitle, Trade } from "@/types"
import ChatBar from "@/components/MainChatInput"
import streamChatCompletion from "@/lib/ai/chatCompletion"

export default function Home({
  searchParams,
}: {
  searchParams?: {
    ticker?: string
    range?: string
    interval?: string
  }
}) {

  const handleKeyPress = async (event: { key: string }) => {
    // Correctly check for the 'Enter' key press
    // console.log("handleKeyPress", event)
    if (event.key === "Enter") {
      streamChatCompletion({
        input: 'What is the return on investment on tesla and apple if I buy $10 worth of stock on 20 June 2024',
        onStart: (initialConversation) => {
          console.log("Starting chat...", initialConversation)
        },
        onUpdate: (nextToken, currentCompletion, currentConversation) => {
          // setInput(currentCompletion)
          // console.log("response", nextToken,currentCompletion, currentConversation )
        },
        onCompletion: (completion, finalConversation) => {
          // console.log('completion', completion);
          // console.log('finalConversation', finalConversation);
          // props.onMessageComplete(completion)
        },
      })
    }
  }

  return (
    <input
        type="text"
        className="w-full rounded-md px-3 py-2"
        value={'What is the return on investment on tesla and apple if I buy $10 worth of stock on 20 June 2024'}
        placeholder="Talk to any stock..."
        onChange={(e) => console.log("onChange", e)}
        // onKeyPress={handleKeyPress}
        onKeyDown={(e) => console.log("onKeyDown", e)}
        onKeyUp={(e) => {
          // console.log("onKeyUp", e);
          handleKeyPress(e);
        }}
      />
  )
}
