'use server'
import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"
import type { SearchResult } from "@/node_modules/yahoo-finance2/dist/esm/src/modules/search"

const fetchStockSearch2 = async (tickers: any) => {
  noStore()
  console.log("~~~~~~~1~~~~~~~~", tickers);
  try {
    const promises = tickers.map(({ symbol }) =>
      yahooFinance.quoteCombine(symbol)
    )
    console.log("~~~~~~~2~~~~~~~~");
    const results = await Promise.all(promises)
    console.log("~~~~~~~3~~~~~~~~", results);
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