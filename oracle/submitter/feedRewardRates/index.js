const { waitSeconds } = require("../../../utils/wait");
const { setRewardRate } = require("../utils/setRewardRate");
const { setBulkRewardRate } = require("../utils/setBulkRewardRate");
const { farms } = require("../config");
const { getAddresses } = require("../../config/address");

function convertToFormalRewardRates(state, beaconRewardRate) {
  return [
    {
      farmId: 0, // OSMO staking
      rewardTokenSymbols: ["arOSMO"],
      rewardRates: [
        beaconRewardRate.syntheticFarms?.osmoStaking?.dailyRewardRate ||
          state.osmosis.osmoStakingDailyRewardRate,
      ],
      APRs: [
        beaconRewardRate.syntheticFarms?.osmoStaking?.apr ||
          state.osmosis.osmoStakingRewardsApr,
      ],
    },
    {
      farmId: 1, // ATOM-OSMO LPing
      rewardTokenSymbols: ["arOSMO"],
      rewardRates: [
        beaconRewardRate.syntheticFarms?.atomOsmo?.dailyRewardRate ||
          state.osmosis.atomOsmoLpTokenDailyRewardRate,
      ],
      APRs: [
        beaconRewardRate.syntheticFarms?.atomOsmo?.apr ||
          state.osmosis.atomOsmoLpTokenReward14DaysBondedApr,
      ],
    },
    {
      farmId: 2,
      rewardTokenSymbols: ["arCAKE"],
      rewardRates: [
        beaconRewardRate.syntheticFarms?.cakeBnb?.dailyRewardRate ||
          state.bsc.pancakeswap.cakeBnb.poolDailyRewardRate,
      ],
      APRs: [
        beaconRewardRate.syntheticFarms?.cakeBnb?.apr ||
          state.bsc.pancakeswap.cakeBnb.poolAPR,
      ],
    },
    {
      farmId: 3,
      rewardTokenSymbols: ["arCAKE"],
      rewardRates: [
        beaconRewardRate.syntheticFarms?.busdBnb?.dailyRewardRate ||
          state.bsc.pancakeswap.busdBnb.poolDailyRewardRate,
      ],
      APRs: [
        beaconRewardRate.syntheticFarms?.busdBnb?.apr ||
          state.bsc.pancakeswap.busdBnb.poolAPR,
      ],
    },
    {
      farmId: 4,
      rewardTokenSymbols: ["arQUICK"],
      rewardRates: [
        beaconRewardRate.syntheticFarms?.quickEthUsdc?.dailyRewardRate ||
          state.poly.polygonData.ethUsdc.dailyRewardRate,
      ],
      APRs: [
        beaconRewardRate.syntheticFarms?.quickEthUsdc?.apr ||
          state.poly.polygonData.ethUsdc.apr,
      ],
    },
    {
      farmId: 5,
      rewardTokenSymbols: ["arQUICK"],
      rewardRates: [
        beaconRewardRate.syntheticFarms?.quickEth?.dailyRewardRate ||
          state.poly.polygonData.quickEth.dailyRewardRate,
      ],
      APRs: [
        beaconRewardRate.syntheticFarms?.quickEth?.apr ||
          state.poly.polygonData.quickEth.apr,
      ],
    },
    {
      farmId: 6,
      rewardTokenSymbols: ["arRAY"],
      rewardRates: [
        beaconRewardRate.syntheticFarms?.raySol?.dailyRewardRate ||
          state.solana.raydium?.raySol?.dailyRewardRate,
      ],
      APRs: [
        beaconRewardRate.syntheticFarms?.raySol?.aprChain ||
          state.solana.raydium?.raySol?.aprChain,
      ],
    },
    {
      farmId: 7,
      rewardTokenSymbols: ["arRAY"],
      rewardRates: [
        beaconRewardRate.syntheticFarms?.rayUsdt?.dailyRewardRate ||
          state.solana.raydium?.rayUsdt?.dailyRewardRate,
      ],
      APRs: [
        beaconRewardRate.syntheticFarms?.rayUsdt?.aprChain ||
          state.solana.raydium?.rayUsdt?.aprChain,
      ],
    },
    {
      farmId: 9,
      rewardTokenSymbols: ["arCRV"],
      rewardRates: [
        beaconRewardRate.syntheticFarms?.curveThreePool?.dailyRewardRate ||
          state.eth.curve.threePool.dailyRewardRate,
      ],
      APRs: [
        beaconRewardRate.syntheticFarms?.curveThreePool?.apr ||
          state.eth.curve.threePool.apr,
      ],
    },
    {
      farmId: 10,
      rewardTokenSymbols: ["arSUSHI", "arTRU"],
      rewardRates: [
        beaconRewardRate.syntheticFarms?.ethTru?.sushiDailyRewardRate ||
          state.eth.sushiswap.ethTru.sushiDailyRewardRate,
        beaconRewardRate.syntheticFarms?.ethTru?.truDailyRewardRate ||
          state.eth.sushiswap.ethTru.truDailyRewardRate,
      ],
      APRs: [
        beaconRewardRate.syntheticFarms?.ethTru?.sushiAPR ||
          state.eth.sushiswap.ethTru.sushiAPR,
        beaconRewardRate.syntheticFarms?.ethTru?.truAPR ||
          state.eth.sushiswap.ethTru.truAPR,
      ],
    },
    {
      farmId: 11,
      rewardTokenSymbols: ["arUSD"],
      rewardRates: [
        beaconRewardRate.syntheticFarms?.usdtAave?.dailyRewardRate ||
          state.eth.aave.usdtAave.dailyRewardRate,
      ],
      APRs: [
        beaconRewardRate.syntheticFarms?.usdtAave?.lendingAPR ||
          state.eth.aave.usdtAave.lendingAPR,
      ],
    },
  ];
}

async function feedRewardRates(state, beaconRewardRate) {
  try {
    const addresses = await getAddresses();
    const farmRewardRates = convertToFormalRewardRates(state, beaconRewardRate);
    console.log("farmRewardRates", farmRewardRates);

    for (let i = 0; i < farmRewardRates.length; i++) {
      const farm = farmRewardRates[i];
      console.log(
        `submitting farm reward information for farmId=${farm.farmId}`
      );
      const addrs = farm.rewardTokenSymbols.map((symbol) => addresses[symbol]);
      await setBulkRewardRate(farm.farmId, addrs, farm.rewardRates);
      await waitSeconds(3);
    }
  } catch (error) {
    console.log(error);
  }
}

exports.convertToFormalRewardRates = convertToFormalRewardRates;
exports.feedRewardRates = feedRewardRates;
