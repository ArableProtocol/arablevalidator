const { fetchUnhealthyAccounts } = require('./fetchUnhealthyAccounts');
const { liquidate } = require('./liquidate');

async function liquidateUnhealthyAccounts() {
  console.log('fetching unhealth accounts');
  const accounts = fetchUnhealthyAccounts();
  console.log('liquidating unhealthy accounts');
  for (let i = 0; i < accounts.length; i++) {
    console.log(`liquidating ${i + 1}th/${accounts.length} account`);
    liquidate(accounts[i]);
    console.log(`liquidated ${i + 1}th/${accounts.length} account`);
  }
  console.log('finalized liquidating accounts and sleeping');
}

async function main() {
  console.log('Undercollateralized positions liquidator, implement it!');
  while (1 == 1) {
    liquidateUnhealthyAccounts();
    await sleep(60000);
  }
}

main();
