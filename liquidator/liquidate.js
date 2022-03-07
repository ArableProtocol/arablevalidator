exports.liquidate = async (unhealthyAccount, liquidationAmount) => {
  console.log('liquidation started');
  // TODO: import collateral and liquidation abi into the repo
  // TODO: initiate the contract with abi and contract address
  // TODO: approve holding arUSD to be used for liquidation
  // TODO: call liquidationContract.liquidate() - check the test of contracts
  // TODO: liquidation amount should be min(account_balance, userDebt)
  // TODO: considering the case user debt could change, contract should be able to accept zero value so that liquidation call can
  // liquidate maximum amount
  // TODO: there could be also the case that currentDebt > collateral - in this case, even though the liquidator get lose, it should be able to
  // be cleared up for protocol's health - contract can handle this case?
  // TODO: implement the mechanism to convert liquidated funds into arUSD or into USDT - the point when to do it - do it instantly?
  console.log('liquidation finished');
};

exports.flagAccount = async (account) => {
  console.log('flagging operation started');
  // TODO: flag account for liquidation
  console.log('flagging operation finished');
};
