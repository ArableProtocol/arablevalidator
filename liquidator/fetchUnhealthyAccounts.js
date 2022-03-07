exports.fetchUnhealthyAccounts = async function () {
  var round = 0;
  var maxRound = 5; // look for maximum of 5000 accounts for now

  // TODO: set theGraphURL
  const theGraphURL = 'https://api.thegraph.com/subgraphs/name/--';

  var totalFlaggableAccounts = [];
  var totalLiquidatableAccounts = [];

  // TODO: get both accounts and global queries as well from the query
  console.log(`${Date().toLocaleString()} fetching unhealthy accounts}`);
  while (round < maxRound) {
    fetch(theGraphURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
      query GET_ACCOUNTS {
        users(first:1000, skip:${
          1000 * count
        }, orderBy: id, orderDirection: desc, where: {debtFactor_gt: 0}) {
          id
        }
      }`,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const totalAccounts = res.data.users.length;
        const { flaggableAccounts, liquidatableAccounts } =
          collectUnhealthyAccounts(res.data);
        console.log(
          `Records:${totalAccounts} Unhealthy:${unhealthyAccounts.length}`
        );
        totalFlaggableAccounts =
          totalFlaggableAccounts.concat(flaggableAccounts);
        totalLiquidatableAccounts =
          totalLiquidatableAccounts.concat(liquidatableAccounts);
      });
    round++;
  }
  return {
    flaggableAccounts: totalFlaggableAccounts,
    liquidatableAccounts: totalLiquidatableAccounts,
  };
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
