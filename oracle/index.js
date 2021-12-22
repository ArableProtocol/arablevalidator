const { collect } = require('./collector');
const { feed } = require('./submitter');
const { executeEpoch } = require('./epoch_actions');
const nodeCron = require('node-cron');
require('dotenv').config();

async function main() {
  await runDataFeedActions();
  await runEpochActions();
}

async function runDataFeedActions() {
  // All scripts will run first second of first minute every hour
  await nodeCron.schedule('1 * * * *', async function () {
    const state = await collect();
    console.log('collection', JSON.stringify(state, null, '\t'));
    await feed(state);
    console.log('feed the oracle successfully!');
  });
}

async function runEpochActions() {
  //this job will only run once a day as the value is hardcode to a day in farming contract.
  //As of now, this will run at 1st min of 1am everyday
  await nodeCron.schedule(' 1 1 * * *', async function () {
    await executeEpoch();
  });
}

main();
