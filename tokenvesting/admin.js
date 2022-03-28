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
    "0x7f6BE03dBb3D863AB1F877f5F9fdEAFa7643af06",
    "0xa08664843c4DdaDcE4215Cf62aA5DF4177D23Ce1",
    "0x267A317D1d18324F1251d34B6Fc65512E5AC35fD",
    "0x9b3635dea44e8cd0c87d6fef2fb2a87855e879e5",
  ]);
}

bulkPermitValidators();

async function setOtcDeals() {
  const addrs = ["0xfc48f1BD8ffa29a377CaA8792F00670C1DcED642"];

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
        currentTimestamp + 120 // 2 mins unlock time
      );
    } catch (err) {
      console.error(err);
    }
  }
}

// setOtcDeals();
