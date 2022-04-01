const {
  releaseVesting,
  rootDistributerReleaseAll,
  dstakingReleaseFromStakingRoot,
  stakingReleaseFromStakingRoot,
  stakingRootDistributeRewards,
  getValidators,
  submitStatus,
} = require('./utils/index.js');

const nodeCron = require('node-cron');
const { waitSeconds } = require('../utils/wait');
require('dotenv').config();

async function runOneTimeTokenVesting() {
  console.log(
    '================ starting one-time token vesting flow ================'
  );

  console.log('====handle release from all====');
  // - RootDistributer.releaseToMemberAll - daily - any user (after release)
  await rootDistributerReleaseAll();
  await waitSeconds(10);
  // - StakingRoot.distributeRewards - daily - any user (after release)
  await stakingRootDistributeRewards();
  await waitSeconds(10);
  // - Staking.claimRewardsFromRoot - daily - any user (after release)
  await stakingReleaseFromStakingRoot();
  await waitSeconds(10);

  if (process.env.VALIDATOR_ADDRESS) {
    await dstakingReleaseFromStakingRoot(process.env.VALIDATOR_ADDRESS);
    // await waitSeconds(10);
  }

  console.log(
    '================ finished one-time token vesting flow ================'
  );
}

runOneTimeTokenVesting();
