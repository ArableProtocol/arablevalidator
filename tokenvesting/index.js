const {
  releaseVesting,
  rootDistributerReleaseAll,
  dstakingReleaseFromStakingRoot,
  stakingReleaseFromStakingRoot,
  stakingRootDistributeRewards,
  getValidators,
  bulkPermitValidatorCreation,
  setOTCDeal,
} = require('./utils/index.js');

const nodeCron = require('node-cron');
const { waitSeconds } = require('../utils/wait');
require('dotenv').config();

async function runTokenVesting() {
  console.log('================ starting token vesting flow ================');
  // TODO: If already claimed for the epoch, not claim again to reduce gas price
  // - ArableVesting.release - daily - any user
  await releaseVesting();
  await waitSeconds(10);
  // - RootDistributer.releaseToMemberAll - daily - any user (after release)
  await rootDistributerReleaseAll();
  await waitSeconds(10);
  // - StakingRoot.distributeRewards - daily - any user (after release)
  await stakingRootDistributeRewards();
  await waitSeconds(10);
  // - Staking.claimRewardsFromRoot - daily - any user (after release)
  await stakingReleaseFromStakingRoot();
  await waitSeconds(10);

  // - DStaking.claimRewardsFromRoot - all the validator - daily - any user (after release)
  if (process.env.VALIDATOR_ADDRESS) {
    await dstakingReleaseFromStakingRoot(process.env.VALIDATOR_ADDRESS);
    await waitSeconds(5);
  } else {
    const dStakingInfos = await getValidators();
    for (let i = 0; i < dStakingInfos.length; i++) {
      await dstakingReleaseFromStakingRoot(dStakingInfos[i].addr);
      await waitSeconds(5);
    }
  }
  console.log('================ finished token vesting flow ================');
}

async function main() {
  // this job will only run once a day as the value is hardcode to a day in farming contract.
  // As of now, this will run at 1st min of 1am everyday
  await nodeCron.schedule(' 1 1 * * *', async function () {
    await runTokenVesting();
  });
}

main();

// runTokenVesting();

// bulkPermitValidatorCreation([
//   '0xF834C6Da7AA4aA71d94c2496554e54103492D5ee',
//   '0xB4084F25DfCb2c1bf6636b420b59eda807953769',
//   '0xD734373209BE506275B96Bc7b287CfcC4454550d',
// ]);

// async function setOtcDeals() {
//   const currentTimestamp = parseInt(Date.now() / 1000);
//   await setOTCDeal(
//     '0x4Ec663E7041C2B0c47c40FC9e1178ad445ab221D',
//     1000,
//     100,
//     currentTimestamp + 864000, // 10 days expiry
//     currentTimestamp + 86400 * 2 // 2 days unlock time
//   );
// }

// setOtcDeals();
