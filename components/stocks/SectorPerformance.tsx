import { cn } from "@/lib/utils"
import { websocketClient } from "@polygon.io/client-js";
const stocksWS = websocketClient("eZXrvnkfa78ZYoz2uzhT0Selo31ZzBl1").stocks();

async function fetchSectorPerformance() {
  try {
    const res = await fetch(`https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09?apiKey=${process.env.POLY_ENV_KEY}`);
    if (!res.ok) {
      throw new Error("Failed to fetch sector performance");
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching sector performance:', error);
    throw error;
  }
}

interface Sector {
  sector: string
  changesPercentage: string
}

export default async function SectorPerformance() {
  const data = (await fetchSectorPerformance()) as Sector[]

  if (!data) {
    return null
  }

  const totalChangePercentage = data.reduce((total, sector) => {
    return total + parseFloat(sector.changesPercentage)
  }, 0)

  const averageChangePercentage =
    (totalChangePercentage / data.length).toFixed(2) + "%"

  const allSectors = {
    sector: "All sectors",
    changesPercentage: averageChangePercentage,
  }
  data.unshift(allSectors)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {data.map((sector: Sector) => (
        <div
          key={sector.sector}
          className="flex w-full flex-row items-center justify-between text-sm"
        >
          <span className="font-medium">{sector.sector}</span>
          <span
            className={cn(
              "w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right transition-colors",
              parseFloat(sector.changesPercentage) > 0
                ? "bg-gradient-to-l from-green-300 text-green-800 dark:from-green-950 dark:text-green-400"
                : "bg-gradient-to-l from-red-300 text-red-800 dark:from-red-950 dark:text-red-500"
            )}
          >
            {parseFloat(sector.changesPercentage).toFixed(2) + "%"}
          </span>
        </div>
      ))}
    </div>
  )
}
