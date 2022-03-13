const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    arableVesting: '0x567b32C78D6275e3575Daa676BbDC3720123B0c8',
    rootDistributor: '0xD0a96D7E8765EB9fb3702246AbA7F5e5e42B4a0B',
    teamDistributor: '0x6b16Ea70e82DefDe1bE123224C124cdBC9A065Cf',
    stakingRoot: '0x78f1442f97dbacC79F1d4C74d3097Dc460d93672',
    staking: '0x96C726cC2Fe6121f8f69ea31594B33f14Ab00d11',
    farming: '0x82bd5ba2ad6aDF7aa1bCb78527d2ab00F6956094',
    otc: '0x363f67e27224779c77633C5296ca22dA2b614693',
  },
  43114: {
    // mainnet
    arableVesting: '0xad1cDD8Fd63d21B39967222c9169735A7f5656CB',
    rootDistributor: '0x842C14962E09FeA54eC9E320a8beE90aD8B32316',
    teamDistributor: '0x5808Df38C39fB0CBe7F65caF4330a887e0924429',
    stakingRoot: '0xfBBd365BCb6eC0485036F3223717927d99EEDFAf',
    staking: '0x4bc722Cd3F7b29ae3A5e0a17a61b72Ea5020502B',
    farming: '0x598EBAC38cF211749b1277c9a34d217226A476Af',
    otc: '0xf3DF637952F9428b2b6d1925124344C56321D88a',
  },
};

const {
  arableVesting: arable_vesting,
  rootDistributor: root_distributer,
  teamDistributor: team_distributer,
  stakingRoot: staking_root,
  staking,
  farming,
  otc,
} = contracts[chainId];

exports.arable_vesting = arable_vesting;
exports.root_distributer = root_distributer;
exports.team_distributer = team_distributer;
exports.staking_root = staking_root;
exports.staking = staking;
exports.farming = farming;
exports.otc = otc;
