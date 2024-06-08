
function calculateROIPercentage(profit: number, allocatedCapital: number): number {    return (profit / allocatedCapital) * 100;
  }
  
  // Example usage
  const profit = 1500; // Profit from the trade
  const allocatedCapital = 15000; // Total capital allocated for the trade
  const roiPercentage = calculateROIPercentage(profit, allocatedCapital);
  
  console.log(`ROI Percentage: ${roiPercentage.toFixed(2)}%`);