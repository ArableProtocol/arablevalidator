# Liquidation Bot

## How it works

- We use TheGraph to monitor users' status and loop all the users per 60s, check liquidatable positions and execute actions

## To get started

Install dependencies `npm install`

## Starting the bot

Execute liquidation script `node index.js`

## User's required information to calculate liquidatable position

- Should be able to get all the users that has debt
- If user is flagged - flagged time is needed to see if it's not expired flag

  - event FlaggedForLiquidation(address user, uint liquidationId, uint liquidationDeadline);

- Users' collateral assets (mapping per asset) - it changes when adding/removing collateral, liquidated

  - event CollateralDeposited (address indexed user, address indexed token, uint256 amount, uint blockNumber);
  - event CollateralWithdrawn (address indexed user, address indexed token, uint256 amount, uint blockNumber);

- Users' \_debtFactor - info. currDebt = \_totalDebt \* \_debtFactor[user] / \_totalDebtFactor
  - event UserDebtFactorIncrease(address indexed user, uint256 amount, uint blockNumber);
  - event UserDebtFactorDecrease(address indexed user, uint256 amount, uint blockNumber);

## Global information required

- \_supportedCollaterals & \_collateralAssetData - allowedRate per collateral

  - event SupportedCollateralAdded(
    address indexed token,
    uint allowedRate,
    uint index,
    address admin,
    uint blockNumber
    );
  - event SupportedCollateralRemoved(
    address indexed token,
    uint index,
    address admin,
    uint blockNumber
    );
  - event CollateralAllowedRateChanged(
    address indexed token,
    uint previousAllowedRate,
    uint newAllowedRate,
    uint index,
    address admin,
    uint blockNumber
    );

- \_liquidationRate
  - event LiquidationRateChanged(uint oldRate, uint newRate, uint blockNumber);
- \_immediateLiquidationRate
  - event ImmediateLiquidationRateChanged(uint oldRate, uint newRate, uint blockNumber);
- \_liquidationDelay
  - event LiquidationDelayChanged(uint oldDelay, uint newDelay, uint blockNumber);
- \_liquidationPenalty
  - event LiquidationPenaltyChanged(uint oldPanelty, uint newPanelty, uint blockNumber);
- \_totalDebtFactor - sum for all the users

  - event UserDebtFactorIncrease(address indexed user, uint256 amount, uint blockNumber);
  - event UserDebtFactorDecrease(address indexed user, uint256 amount, uint blockNumber);

- \_totalDebt
  - event TotalDebtUpdate(uint256 newTotalDebt, uint256 timestamp);
- Price of collatereals - from oracle contract
  - event SetTokenPrice(address token, uint256 price, uint256 timestamp);
- lastUpdate (latest value of timestamp of below events)
  - event SetTokenPrice(address token, uint256 price, uint256 timestamp);
  - event SetRewardRate(uint256 farmId, address rewardToken, uint256 rate, uint256 timestamp);

## Actions to make by liquidation bot

- Flag operation
- Liquidation operation
