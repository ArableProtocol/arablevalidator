const { updateRewardRateSums } = require("./updateRewardRate");
const { startNewMinterEpoch } = require("./minterRewards");

exports.executeEpoch = async function () {
  await updateRewardRateSums();
};

exports.startNewMinterEpoch = async function () {
  await startNewMinterEpoch();
};
