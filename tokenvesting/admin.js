const {
  releaseVesting,
  rootDistributerReleaseAll,
  dstakingReleaseFromStakingRoot,
  stakingReleaseFromStakingRoot,
  stakingRootDistributeRewards,
  getValidators,
  bulkPermitValidatorCreation,
  setOTCDeal,
} = require("./utils/index.js");

const { waitSeconds } = require("../utils/wait");
require("dotenv").config();

async function runTokenVesting() {
  console.log("================ starting token vesting flow ================");
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
  const dStakingInfos = await getValidators();
  for (let i = 0; i < dStakingInfos.length; i++) {
    await dstakingReleaseFromStakingRoot(dStakingInfos[i].addr);
    await waitSeconds(5);
  }
  console.log("================ finished token vesting flow ================");
}

// runTokenVesting();

async function bulkPermitValidators() {
  await bulkPermitValidatorCreation([
    "0x5881eB65a3a4F55D77D8A607eC59691921083A3f",
  ]);
}

bulkPermitValidators();

async function setOtcDeals() {
  const addrs = ["0x63Ae3D5E3ad8d05C676E15d012b8823B6986AD58"];

  const acreAmounts = [300000];
  const usdAmounts = [24000];

  const currentTimestamp = parseInt(Date.now() / 1000);
  for (let i = 0; i < addrs.length; i++) {
    try {
      await setOTCDeal(
        addrs[i],
        acreAmounts[i],
        usdAmounts[i],
        currentTimestamp + 864000, // 10 days expiry
        currentTimestamp + 120 // 2 days unlock time
      );
    } catch (err) {
      console.error(err);
    }
  }
}

// setOtcDeals();
