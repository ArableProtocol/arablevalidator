var axios = require('axios');
var { BigNumber } = require('ethers');
var { parseEther } = require('ethers/lib/utils');
var { formatBigNumber } = require('../utils/format');

exports.fetchUnhealthyAccounts = async function () {
  var round = 0;
  var maxRound = 1; // look for maximum of 5000 accounts for now

  try {
    // https://thegraph.com/hosted-service/subgraph/arableprotocol/arable-liquidation-fuji
    const theGraphURL =
      'https://api.thegraph.com/subgraphs/name/arableprotocol/arable-liquidation-fuji';

    const globalInfos = (
      await axios.post(
        theGraphURL,
        {
          query: `{
          globalInfos(first: 1) {
            id
            liquidationRate
            immediateLiquidationRate
            liquidationDelay
            liquidationPenalty
            totalDebtFactor
            totalDebt
          }
          prices(first: 1000) {
            id
            price
            address
          }
          rewardRates(first: 1000) {
            id
            farmId
            rewardToken
            rate
          }
          collateralAssets(first: 1000) {
            id
            address
            allowedRate
          }
        }`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    ).data.data;

    var totalFlaggableAccounts = [];
    var totalLiquidatableAccounts = [];

    // TODO: get both accounts and global queries as well from the query
    console.log(`fetching unhealthy accounts`);
    while (round < maxRound) {
      const users = (
        await axios.post(
          theGraphURL,
          {
            query: `{
            users(first: 1000, where:{debtFactor_gt:1}) {
              id
              liquidationDeadline
              address
    					debtFactor
              collateralAssets {
                id
                amount
                collateralAsset {
                  address
                }
              }
            }
          }`,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      ).data.data.users;

      const { flaggableAccounts, liquidatableAccounts } =
        collectUnhealthyAccounts(users, globalInfos);
      totalFlaggableAccounts = totalFlaggableAccounts.concat(flaggableAccounts);
      totalLiquidatableAccounts =
        totalLiquidatableAccounts.concat(liquidatableAccounts);
      round++;
    }
    return {
      flaggableAccounts: totalFlaggableAccounts,
      liquidatableAccounts: totalLiquidatableAccounts,
    };
  } catch (error) {
    console.error(error);
    return {
      flaggableAccounts: [],
      liquidatableAccounts: [],
    };
  }
};

function collectUnhealthyAccounts(users, globalInfos) {
  // console.log('globalInfos', globalInfos);
  // console.log('users', users);

  const {
    totalDebtFactor: totalDebtFactor_,
    totalDebt: totalDebt_,
    liquidationRate: liquidationRate_,
    immediateLiquidationRate: immediateLiquidationRate_,
  } = globalInfos.globalInfos[0];

  let totalDebtFactor = BigNumber.from(totalDebtFactor_);
  let totalDebt = BigNumber.from(totalDebt_);
  let liquidationRate = BigNumber.from(liquidationRate_ || 0);
  let immediateLiquidationRate = BigNumber.from(immediateLiquidationRate_ || 0);

  const { collateralAssets, prices } = globalInfos;

  const allowedRateMapping = {};
  for (let i = 0; i < collateralAssets.length; i++) {
    allowedRateMapping[collateralAssets[i].address] = BigNumber.from(
      collateralAssets[i].allowedRate
    );
  }

  const priceMapping = {};
  for (let i = 0; i < prices.length; i++) {
    priceMapping[prices[i].address] = BigNumber.from(prices[i].price);
  }

  var flaggableAccounts = [];
  var liquidatableAccounts = [];
  users.forEach((user) => {
    let currDebt = totalDebt.mul(user.debtFactor).div(totalDebtFactor);
    let maxDebt = BigNumber.from(0);
    let userCollaterals = user.collateralAssets;
    for (let i = 0; i < userCollaterals.length; i++) {
      const userCollateral = userCollaterals[i];
      if (userCollateral.amount > 0) {
        const collateralAddress = userCollateral.collateralAsset.address;
        let allowedRate = allowedRateMapping[collateralAddress];
        if (allowedRate.gt(0)) {
          let normalizedAmount = BigNumber.from(userCollateral.amount)
            .mul(parseEther('1'))
            .div(
              BigNumber.from(Math.pow(10, decimals[collateralAddress] || 18))
            );
          let collateralValue = normalizedAmount
            .mul(priceMapping[collateralAddress])
            .div(parseEther('1'));
          maxDebt = maxDebt.add(
            collateralValue.mul(parseEther('1')).div(allowedRate)
          );
        }
      }
    }

    let userLiquidationRate = BigNumber.from(0);
    if (maxDebt.gt(0)) {
      userLiquidationRate = currDebt.mul(parseEther('1')).div(maxDebt);
    } else if (currDebt.gt(0)) {
      userLiquidationRate = parseEther('100'); // 10000%
    }

    console.log(
      'userLiquidationRate',
      formatBigNumber(userLiquidationRate, 18, 2),
      user.address,
      formatBigNumber(currDebt, 18, 2),
      formatBigNumber(maxDebt, 18, 2)
    );
    console.log(
      'globalliquidationRate',
      formatBigNumber(liquidationRate, 18, 2)
    );
    console.log(
      'globalImmediateLiquidationRate',
      formatBigNumber(immediateLiquidationRate, 18, 2)
    );

    if (userLiquidationRate.lt(liquidationRate)) {
      return;
    }

    if (userLiquidationRate.gte(immediateLiquidationRate)) {
      liquidatableAccounts.push(user);
    } else {
      // TODO: should update this to use on-chain information
      const currTimestamp = Math.floor(Date.now() / 1000);
      console.log('user.liquidationDeadline', user.liquidationDeadline);
      console.log('currTimestamp', currTimestamp);
      if (user.liquidationDeadline == 0) {
        flaggableAccounts.push(user);
      } else if (user.liquidationDeadline <= currTimestamp) {
        liquidatableAccounts.push(user);
      }
    }
  });

  console.log('flaggableAccounts', flaggableAccounts);
  console.log('liquidatableAccounts', liquidatableAccounts);

  return {
    flaggableAccounts,
    liquidatableAccounts,
  };
}
