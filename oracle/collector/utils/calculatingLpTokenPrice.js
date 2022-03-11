function calculateLpTokenPrice(
  tokenOneSupply,
  tokenOnePrice,
  tokenTwoSupply,
  tokenTwoPrice,
  totalSupply
) {
  const tokenOneLiquidity = tokenOneSupply * tokenOnePrice;
  const tokenTwoLiquidity = tokenTwoSupply * tokenTwoPrice;

  if (
    tokenOneLiquidity < tokenTwoLiquidity * 0.9 ||
    tokenOneLiquidity > tokenTwoLiquidity * 1.1
  ) {
    throw 'parameters are incorrect for liquidity price calculation!';
  }
  const totalLiquidity = tokenOneLiquidity + tokenTwoLiquidity;
  const lpTokenPrice = totalLiquidity / totalSupply;

  return lpTokenPrice;
}

exports.calculateLpTokenPrice = calculateLpTokenPrice;
