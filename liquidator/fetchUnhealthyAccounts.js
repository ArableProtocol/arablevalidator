var axios = require('axios');
var { parseEther } = require('ethers/lib/utils');

exports.fetchUnhealthyAccounts = async function () {
  var round = 0;
  var maxRound = 5; // look for maximum of 5000 accounts for now

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
            liquidateRate
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
    console.log(`${Date().toLocaleString()} fetching unhealthy accounts}`);
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
  console.log('globalInfos', globalInfos);
  console.log('users', users);

  const {
    totalDebtFactor,
    totalDebt,
    liquidationRate,
    immediateLiquidationRate,
  } = globalInfos.globalInfos[0];

  const { collateralAssets, prices } = globalInfos;

  const allowedRateMapping = {};
  for (let i = 0; i < collateralAssets.length; i++) {
    allowedRateMapping[collateralAssets[i].address] =
      collateralAssets[i].allowedRate;
  }

  const priceMapping = {};
  for (let i = 0; i < prices.length; i++) {
    priceMapping[prices[i].address] = prices[i].price;
  }

  var flaggableAccounts = [];
  var liquidatableAccounts = [];
  users.forEach((user) => {
    let currDebt = (totalDebt * user.debtFactor) / totalDebtFactor;
    let maxDebt = 0;
    let userCollaterals = user.collateralAssets;
    for (let i = 0; i < userCollaterals.length; i++) {
      const userCollateral = userCollaterals[i];
      if (userCollateral.amount > 0) {
        const collateralAddress = userCollateral.collateralAsset.address;
        let allowedRate = allowedRateMapping[collateralAddress];
        if (allowedRate.gt(0)) {
          let collateralValue = userCollateral.amount
            .mul(priceMapping[collateralAddress])
            .div(parseEther('1'));
          maxDebt = maxDebt.add(
            collateralValue.mul(parseEther('1')).div(allowedRate)
          );
        }
      }
    }

    let userLiquidationRate = BigNumber.Zero();
    if (maxDebt.gt(0)) {
      userLiquidationRate = currDebt.mul(parseEther('1')).div(maxDebt);
    }

    if (userLiquidationRate.lt(liquidationRate)) {
      return;
    }

    if (userLiquidationRate.gte(immediateLiquidationRate)) {
      liquidatableAccounts.push(user);
    }

    // TODO: should update this to use on-chain information
    const currTimestamp = Math.floor(Date.now().getTime() / 1000);
    if (user.liquidationDeadline.isZero()) {
      flaggableAccounts.push(user);
    } else if (user.liquidationDeadline >= currTimestamp) {
      liquidatableAccounts.push(user);
    }
  });

  console.log('flaggableAccounts', flaggableAccounts);
  console.log('liquidatableAccounts', liquidatableAccounts);

  return {
    flaggableAccounts,
    liquidatableAccounts,
  };
}
