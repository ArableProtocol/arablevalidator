exports.startNewMinterEpoch = async function () {
  try {
    // TODO: implement!
    // Execute once per 8 hrs - only by oracle providers
    // function startNewEpoch() public override onlyAllowedProvider
    // Should check if it's going to reverted and if so should stop
  } catch (error) {
    console.log(error);
  }
};

exports.increaseMinterRewards = async function () {
  try {
    // TODO: implement!
    // run 30 mins after increasing epoch
    // epochDistributableAmount can be fetched on TheGraph
    // Event is emited when starting new epoch - emit SetEpochTokenRewards(epochNumber, rewardToken, getTotalDistributableRewards(rewardToken));
    // function increaseMinterRewards(address minter, address rewardToken, uint256 amount)
    // minterRewardAmount = epochDistributableAmount * _debtFactor /  _totalDebtFactor
    // Once per epoch - fine to run twice - next ones rejected
    // Should check if it's going to reverted and if so should stop
  } catch (error) {
    console.log(error);
  }
};
