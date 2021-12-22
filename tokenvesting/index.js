const {
  releaseVesting,
  rootDistributerReleaseAll,
  dstakingReleaseFromStakingRoot,
  stakingReleaseFromStakingRoot,
  stakingRootDistributeRewards,
  getValidators,
} = require('./utils/index.js');

const nodeCron = require('node-cron');
require('dotenv').config();

async function runTokenVesting() {
  console.log('================ starting token vesting flow ================');
  // TODO: If already claimed for the epoch, not claim again to reduce gas price
  // - ArableVesting.release - daily - any user
  await releaseVesting();
  // - RootDistributer.releaseToMemberAll - daily - any user (after release)
  await rootDistributerReleaseAll();
  // - StakingRoot.distributeRewards - daily - any user (after release)
  await stakingRootDistributeRewards();
  // - Staking.claimRewardsFromRoot - daily - any user (after release)
  await stakingReleaseFromStakingRoot();

  // - DStaking.claimRewardsFromRoot - all the validator - daily - any user (after release)
  const dStakingInfos = await getValidators();
  for (let i = 0; i < dStakingInfos.length; i++) {
    await dstakingReleaseFromStakingRoot(dStakingInfos[i].addr);
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