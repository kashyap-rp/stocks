interface OptionCall {
  strikePrice: number
  premium: number
  currentPrice: number
  investmentAmount: number
}

export const calculateOptionCallROI = (option: OptionCall): number => {
  const { strikePrice, premium, currentPrice, investmentAmount } = option
  const numberOfOptions = investmentAmount / premium
  const profitPerOption = Math.max(0, currentPrice - strikePrice)
  const totalProfit = profitPerOption * numberOfOptions
  const totalInvestment = numberOfOptions * premium
  const roi = ((totalProfit - totalInvestment) / totalInvestment) * 100
  return roi
}
