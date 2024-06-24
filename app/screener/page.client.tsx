import type { Metadata } from "next"
import { columns } from "@/app/screener/components/columns"
import { DataTable } from "@/app/screener/components/data-table"
// import { DEFAULT_SCREENER } from "@/lib/alpha-finance/constants"
import { fetchScreenerStocks } from "@/lib/alpha-finance/fetchScreenerStocks"

export const metadata: Metadata = {
  title: "Easy Stocks: Stock screener",
  description: "Find the best stocks to buy now with the Easy Stocks stock screener.",
}
export default async function ScreenerPage({
  searchParams,
}: {
  searchParams?: {
    screener?: string
  }
}) {
  // const screener = searchParams?.screener || DEFAULT_SCREENER

  // const screenerDataResults = await fetchScreenerStocks(screener)

  return (
    <></>
    // <div>
    //   <DataTable columns={columns} data={screenerDataResults.quotes} />
    // </div>
  )
}
