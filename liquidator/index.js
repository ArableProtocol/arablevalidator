const { fetchUnhealthyAccounts } = require('./fetchUnhealthyAccounts');
const {
  liquidate,
  flagAccount,
  approveArUSDForLiquidation,
} = require('./liquidate');
const { waitSeconds } = require('../utils/wait');

async function liquidateUnhealthyAccounts() {
  console.log('fetching unhealthy accounts');

  // fetch flaggable accounts
  const { flaggableAccounts, liquidatableAccounts } =
    await fetchUnhealthyAccounts();

  // approve arUSD for liquidation
  await approveArUSDForLiquidation();

  // start liquidating
  console.log('liquidating unhealthy accounts');
  for (let i = 0; i < liquidatableAccounts.length; i++) {
    console.log(
      `liquidating ${i + 1}th/${liquidatableAccounts.length} account`
    );
    await liquidate(liquidatableAccounts[i]);
    console.log(`liquidated ${i + 1}th/${liquidatableAccounts.length} account`);
    await waitSeconds(10);
  }

  // start flagging
  for (let i = 0; i < flaggableAccounts.length; i++) {
    console.log(`flagging ${i + 1}th/${flaggableAccounts.length} account`);
    await flagAccount(flaggableAccounts[i]);
    console.log(`flagged ${i + 1}th/${flaggableAccounts.length} account`);
    await waitSeconds(10);
  }
  console.log('finalized liquidating accounts and sleeping');
}

async function main() {
  console.log('Unhealthy accounts liquidator starting!');
  while (1 == 1) {
    await liquidateUnhealthyAccounts();
    await waitSeconds(60);
  }
}

main();
