import { cn } from "@/lib/utils"
// api_Key="P5IY74QSU3Q7KSNC"

async function fetchSectorPerformance() {
  try {
    const API_KEY = process.env.ALPHA_VANTAGE_KEY;
    const res = await fetch(`https://www.alphavantage.co/query?function=SECTOR&apikey=${API_KEY}`);
    if (!res.ok) {
      console.error("Failed to fetch sector performance");
      return [];
    }
    const data = await res.json();
    // Transform the data into the expected format
    return Object.entries(data['Rank A: Real-Time Performance'] || {}).map(([sector, changesPercentage]) => ({
      sector,
      changesPercentage: (parseFloat(changesPercentage as string) * 100).toFixed(2)
    }));
  } catch (error) {
    console.error('Error fetching sector performance:', error);
    return [];
  }
}

interface Sector {
  sector: string
  changesPercentage: string
}

export default async function SectorPerformance() {
  const data = (await fetchSectorPerformance()) as Sector[]

  if (!data.length) {
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
