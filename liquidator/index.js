require("dotenv").config();
const { fetchUnhealthyAccounts } = require("./fetchUnhealthyAccounts");
const {
  liquidate,
  flagAccount,
  approveArUSDForLiquidation,
} = require("./liquidate");
const { waitSeconds } = require("../utils/wait");
const { getBackendApiUrl } = require("./config/network");
const nodeCron = require("node-cron");
const axios = require("axios");
const { Wallet } = require("ethers");
const version = require("../config/version.json");

async function submitLiquidationStatus(dstaking) {
  const backendApiUrl = getBackendApiUrl();

  const signer = new Wallet(process.env.PRIVATE_KEY);

  const signature = await signer.signMessage(dstaking);

  await axios.post(`${backendApiUrl}/liquidations`, {
    dstaking,
    signature,
    version: version.liquidation,
  });
}

async function liquidateUnhealthyAccounts() {
  console.log("fetching unhealthy accounts");

  // fetch flaggable accounts
  const { flaggableAccounts, liquidatableAccounts } =
    await fetchUnhealthyAccounts();

  // approve arUSD for liquidation
  await approveArUSDForLiquidation();

  // start liquidating
  console.log("liquidating unhealthy accounts");
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
  console.log("finalized liquidating accounts and sleeping");
}

async function main() {
  console.log("Unhealthy accounts liquidator starting!");

  // liquidate unhealthy accounts per 15 min
  nodeCron.schedule("*/15 * * * *", async function () {
    try {
      await liquidateUnhealthyAccounts();
      console.log("====submit liquidator status===");
      await submitLiquidationStatus(process.env.VALIDATOR_ADDRESS);
    } catch (error) {
      console.error(error);
    }
  });

  // liquidate unhealthy accounts per min
  // while (1 == 1) {
  //   await liquidateUnhealthyAccounts();
  //   await waitSeconds(60);
  // }
}

main();
