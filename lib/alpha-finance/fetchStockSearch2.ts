'use server'
import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"
import type { SearchResult } from "@/node_modules/yahoo-finance2/dist/esm/src/modules/search"

const fetchStockSearch2 = async (tickers: any) => {
  noStore()

  try {
    const promises = tickers.map(({ symbol }) =>
      yahooFinance.quoteCombine(symbol)
    )
    const results = await Promise.all(promises)
    return results;
    // const _x = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    // return _x.json();
  } catch (error) {
    console.log("Failed to fetch stock search", error)
    throw new Error("Failed to fetch stock search.")
  }
}

export {
  fetchStockSearch2
};