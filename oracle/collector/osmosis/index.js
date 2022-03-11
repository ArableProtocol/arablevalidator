const axios = require('axios');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
const { calculateLpTokenPrice } = require('../utils/calculatingLpTokenPrice');

async function collect_osmosis(coingecko) {
  // const osmoInfo = await coinGeckoApi.coins.fetch('osmosis', {});
  // const osmoSupply = osmoInfo.data.market_data.circulating_supply;
  // console.log('osmoInfo', osmoInfo);
  //const osmoSupply = osmoInfo.data.market_data.total_supply

  // compute ATOM-OSMO LP token price
  const poolId = 1; //ATOM-OSMO
  const poolData = await axios
    .get('https://lcd-osmosis.keplr.app/osmosis/gamm/v1beta1/pools/' + poolId)
    .then((res) => res.data.pool);

  const atom = poolData.poolAssets[0];
  const osmo = poolData.poolAssets[1];

  if (atom.weight != osmo.weight) {
    throw `ATOM ${atom.weight} and OSMO ${osmo.weight} weight do not match!`;
  }

  const totalLpAtom = atom.token.amount / 10.0 ** 6;
  const atomPrice = coingecko.prices.cosmos.usd;
  const totalLpOsmo = osmo.token.amount / 10.0 ** 6;
  const osmoPrice = coingecko.prices.osmosis.usd;
  const shareSupply = poolData.totalShares.amount / 10.0 ** 18;
  const lpTokenPrice = calculateLpTokenPrice(
    totalLpAtom,
    atomPrice,
    totalLpOsmo,
    osmoPrice,
    shareSupply
  );

  // https://api-osmosis.imperator.co/swagger/#/

  // compute LP token reward APY for 14 day bondage
  // const distrInfo = await axios
  //   .get(
  //     'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/distr_info'
  //   )
  //   .then((res) => res.data.distr_info);
  // const totalWeight = distrInfo.total_weight;

  // const incentivizedPools = await axios
  //   .get(
  //     'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/incentivized_pools'
  //   )
  //   .then((res) =>
  //     res.data.incentivized_pools.filter((ip) => ip.pool_id == poolId)
  //   );
  // const mintParams = await axios
  //   .get('https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/params')
  //   .then((res) => res.data.params);
  // const epochs = await axios
  //   .get('https://lcd-osmosis.keplr.app/osmosis/epochs/v1beta1/epochs')
  //   .then((res) => res.data.epochs);
  // const epochProvision = await axios
  //   .get('https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/epoch_provisions')
  //   .then((res) => res.data.epoch_provisions / 10.0 ** 6);

  // function computeDailyLpRewardRate(duration) {
  //   const gaugeId = incentivizedPools.filter(
  //     (ip) => ip.lockable_duration == duration
  //   )[0].gauge_id;
  //   const potWeight = distrInfo.records.filter((r) => r.gauge_id == gaugeId)[0]
  //     .weight;

  //   const epochIdentifier = mintParams.epoch_identifier;

  //   const epoch = epochs.filter((e) => e.identifier == epochIdentifier)[0];
  //   const epochDuration = dayjs.duration(
  //     parseInt(epoch.duration.replace('s', '')) * 1000
  //   );

  //   const numEpochsPerDay =
  //     dayjs.duration({ days: 1 }).asMilliseconds() /
  //     epochDuration.asMilliseconds();

  //   const dayProvision = epochProvision * numEpochsPerDay;
  //   const dayProvisionToPots =
  //     dayProvision * mintParams.distribution_proportions.pool_incentives;
  //   const dayProvisionToPot = dayProvisionToPots * (potWeight / totalWeight);
  //   // TODO: not share supply but should divide by total bonded
  //   return dayProvisionToPot / shareSupply;
  // }

  // function computeStakingApr() {
  //   const numEpochsPerYear = 365;
  //   const yearProvision = epochProvision * numEpochsPerYear;
  //   const yearProvisionToPot =
  //     (yearProvision * mintParams.distribution_proportions.staking) / 10.0 ** 6;
  //   return yearProvisionToPot / totalStaked;
  // }

  // lockable durations: https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/lockable_durations

  function computeLpRewardsApr(dailyRewardRate) {
    return (dailyRewardRate * 365 * osmoPrice) / lpTokenPrice;
  }

  function computeRewardRateFromAPR(apr) {
    return (apr * lpTokenPrice) / osmoPrice / 365;
  }

  // const rewardRate1day = computeDailyLpRewardRate('86400s');
  // const rewardRate7days = computeDailyLpRewardRate('604800s') + rewardRate1day;
  // const rewardRate14days =
  //   computeDailyLpRewardRate('1209600s') + rewardRate7days;

  // const rewardApr14days = computeLpRewardsApr(rewardRate14days);

  // get staking APR from api
  const osmoStakingRewardsApr = await axios
    .get('https://api-osmosis.imperator.co/apr/v2/staking')
    .then((res) => res.data / 100);
  // console.log('osmoStakingRewardsApr', osmoStakingRewardsApr);

  // get LP reward APR from api
  const rewardApr14days = await axios
    .get(`https://api-osmosis.imperator.co/apr/v1/${poolId}`)
    .then((res) => res.data[0].apr_list[0].apr_14d / 100);
  const rewardRate14days = computeRewardRateFromAPR(rewardApr14days);
  // console.log('rewardRate14days', rewardRate14days);
  // console.log('rewardApr14days', rewardApr14days);

  return {
    osmoStakingDailyRewardRate: osmoStakingRewardsApr / 365,
    osmoStakingRewardsApr: osmoStakingRewardsApr,
    osmoStakingRewardsAprPercent:
      (100.0 * osmoStakingRewardsApr).toFixed(2) + '%',
    atomOsmoLpTokenDailyRewardRate: rewardRate14days,
    atomOsmoLpTokenPrice: lpTokenPrice,
    atomOsmoLpTokenReward14DaysBondedApr: rewardApr14days,
    atomOsmoLpTokenReward14DaysBondedAprPercent:
      (100.0 * rewardApr14days).toFixed(2) + '%',
  };
}

exports.collect_osmosis = collect_osmosis;
