'use server'
import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"

export async function fetchQuote(ticker: string) {
  noStore()

  try {
    console.log("=====S1====", ticker);
    const response = await yahooFinance.quote(ticker)
    console.log("=====S2====", response);
    return response
  } catch (error) {
    console.log("Failed to fetch stock quote", error)
    throw new Error("Failed to fetch stock quote.")
  }
}
