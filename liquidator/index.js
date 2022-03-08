const { fetchUnhealthyAccounts } = require('./fetchUnhealthyAccounts');
const { liquidate, flagAccount } = require('./liquidate');
const { waitSeconds } = require('../utils/wait');

async function liquidateUnhealthyAccounts() {
  console.log('fetching unhealth accounts');

  const { flaggableAccounts, liquidatableAccounts } =
    await fetchUnhealthyAccounts();
  console.log('liquidating unhealthy accounts');
  for (let i = 0; i < liquidatableAccounts.length; i++) {
    console.log(
      `liquidating ${i + 1}th/${liquidatableAccounts.length} account`
    );
    liquidate(liquidatableAccounts[i]);
    console.log(`liquidated ${i + 1}th/${liquidatableAccounts.length} account`);
  }
  for (let i = 0; i < flaggableAccounts.length; i++) {
    console.log(`flagging ${i + 1}th/${flaggableAccounts.length} account`);
    flagAccount(flaggableAccounts[i]);
    console.log(`flagged ${i + 1}th/${flaggableAccounts.length} account`);
  }
  console.log('finalized liquidating accounts and sleeping');
}

async function main() {
  console.log('Unhealthy accounts liquidator starting!');
  while (1 == 1) {
    liquidateUnhealthyAccounts();
    await waitSeconds(60);
  }
}

main();
