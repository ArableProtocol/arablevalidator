const { collect } = require("./collector");
const { feed } = require("./submitter");
const { executeEpoch, startNewMinterEpoch } = require("./epoch_actions");

const nodeCron = require("node-cron");
const { submitOracleStatus } = require("./utils");
// const { state } = require('./state');
require("dotenv").config();

const startMinute = Math.floor(Math.random() * 100000) % 60;

async function main() {
  await runDataFeedActions();
  await runEpochActions();
  await minterRewards();

  nodeCron.schedule("*/15 * * * *", async function () {
    console.log("====submit oracle status===");
    await submitOracleStatus(process.env.VALIDATOR_ADDRESS);
  });
}

async function runDataFeedActions() {
  // All scripts will run first second of first minute every hour
  const minute = startMinute;
  await nodeCron.schedule(`${minute} * * * *`, async function () {
    const state = await collect();
    console.log("collection", JSON.stringify(state, null, "\t"));
    await feed(state);
    console.log("feed the oracle successfully!");
  });
}

async function runEpochActions() {
  // On testnet we run the epoch action once per hour
  const minute = (startMinute + 20) % 60;
  await nodeCron.schedule(`${minute} * * * *`, async function () {
    await executeEpoch();
  });

  //this job will only run once a day as the value is hardcode to a day in farming contract.
  //As of now, this will run at 1st min of 1am everyday
  // await nodeCron.schedule('1 1 * * *', async function () {
  //   await executeEpoch();
  // });
}

async function minterRewards() {
  // On testnet we run the epoch action once per 8 hours - run every 1st hour of 8 hours
  // TODO: configure
  const minute = (startMinute + 40) % 60;

  await nodeCron.schedule(`${minute} * * * *`, async function () {
    await startNewMinterEpoch();
  });
}

main();
