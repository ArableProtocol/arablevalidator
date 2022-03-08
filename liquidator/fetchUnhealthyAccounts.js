var axios = require('axios');

exports.fetchUnhealthyAccounts = async function () {
  var round = 0;
  var maxRound = 5; // look for maximum of 5000 accounts for now

  try {
    const theGraphURL =
      'https://thegraph.com/hosted-service/subgraph/arableprotocol/arable-liquidation-fuji';

    const globalInfos = await axios.post(
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
        }`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('globalInfos', globalInfos);

    var totalFlaggableAccounts = [];
    var totalLiquidatableAccounts = [];

    // TODO: get both accounts and global queries as well from the query
    console.log(`${Date().toLocaleString()} fetching unhealthy accounts}`);
    while (round < maxRound) {
      const users = await axios.post(
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
      );

      console.log('users', users);

      const totalAccounts = users.length;
      const { flaggableAccounts, liquidatableAccounts } =
        collectUnhealthyAccounts(users);
      console.log(
        `Records:${totalAccounts} Unhealthy:${unhealthyAccounts.length}`
      );
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

function collectUnhealthyAccounts(payload) {
  var flaggableAccounts = [];
  var liquidatableAccounts = [];
  payload.users.forEach((user, i) => {
    // TODO: check if flagged and passed enough time, push to unhealthy list
    // TODO: check if reached immediate liquidation level, push to unhealthy list
    // TODO: determine which fields to add here - liquidation amount, account address accounts.push({});
  });

  return {
    flaggableAccounts,
    liquidatableAccounts,
  };
}
