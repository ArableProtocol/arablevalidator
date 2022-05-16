const { updateRewardRateSums } = require("./updateRewardRate");
const { startNewEpoch, increaseMinterRewards } = require("./minterRewards");

exports.executeEpoch = async function () {
  await updateRewardRateSums();
};

exports.startNewMinterEpoch = async function () {
  await startNewEpoch();
};
