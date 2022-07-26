const { waitSeconds } = require("../../../utils/wait");
const { fee_collector_abi } = require("../abi/fee_collector_abi");
var axios = require("axios");
const { BigNumber, Contract } = require("ethers");
const { getAddresses } = require("../../config/address");
const {
  setup,
  getLiquidationSubgraphEndPoint,
  getEthersProvider,
} = require("../../config/network");

const web3 = setup();
const ethersProvider = getEthersProvider();

exports.startNewMinterEpoch = async function () {
  try {
    // TODO: implement!
    const { feeCollector } = getAddresses();
    const account = web3.eth.accounts.privateKeyToAccount(
      process.env.PRIVATE_KEY
    );
    await web3.eth.accounts.wallet.add(account);
    const myAccount = account.address;
    const gasPrice = await web3.eth.getGasPrice();
    const feeCollectorContract = new web3.eth.Contract(
      fee_collector_abi,
      feeCollector
    );
    const startNewEpoch = feeCollectorContract.methods.startNewEpoch();

    let estimatedGas = 0;
    try {
      estimatedGas = await startNewEpoch.estimateGas({
        from: myAccount,
        gasLimit: 1000000,
        gasPrice,
      });
    } catch (error) {
      console.log("gas estimation error", error);
    }

    if (estimatedGas !== 0) {
      const txObj = await startNewEpoch.send({
        from: myAccount,
        gasLimit: 1000000,
        gasPrice,
      });
      console.log("startNewEpoch Success!", txObj.transactionHash);
      const txReceipt = await web3.eth.getTransaction(txObj.transactionHash);
      // await waitSeconds(30);
      // await increaseMinterRewards(txReceipt.blockNumber);
      return txObj.transactionHash;
    }

    // Execute once per 8 hrs - only by oracle providers
    // function startNewEpoch() public override onlyAllowedProvider
    // Should check if it's going to reverted and if so should stop
  } catch (error) {
    console.log(error);
  }
};

exports.listenNewEpoch = function () {
  const { feeCollector } = getAddresses();

  const contract = new Contract(
    feeCollector,
    fee_collector_abi,
    ethersProvider
  );

  console.log("===listen new epoch===");

  contract.on("EpochStart", (epochNumber, epochStartBlock, epochStartTime) => {
    console.log("====epochStart===", epochStartBlock);
    const blockNumber = epochStartBlock.toNumber();
    const epochStartTime = epochStartTime.toNumber();

    const handle = async () => {
      await waitSeconds(60);
      await increaseMinterRewards(blockNumber, epochStartTime);
    };

    handle().then();
  });
};

const increaseMinterRewards = async function (blockNumber, epochStartTime) {
  try {
    const { ACRE, feeCollector } = await getAddresses();

    console.log(
      `==increaseMinterRewards at block: ${blockNumber}==epochStartTime: ${epochStartTime}====`
    );
    // TODO: implement!
    // run 30 mins after increasing epoch
    // epochDistributableAmount can be fetched on TheGraph
    // Event is emited when starting new epoch - emit SetEpochTokenRewards(epochNumber, rewardToken, getTotalDistributableRewards(rewardToken));
    // function increaseMinterRewards(address minter, address rewardToken, uint256 amount)
    // minterRewardAmount = epochDistributableAmount * _debtFactor /  _totalDebtFactor
    // Once per epoch - fine to run twice - next ones rejected
    // Should check if it's going to reverted and if so should stop
    const rewardTokens = [ACRE];

    const { users } = await fetchMintersInfo(blockNumber);

    const account = web3.eth.accounts.privateKeyToAccount(
      process.env.PRIVATE_KEY
    );
    await web3.eth.accounts.wallet.add(account);
    const myAccount = account.address;
    const gasPrice = await web3.eth.getGasPrice();
    const feeCollectorContract = new web3.eth.Contract(
      fee_collector_abi,
      feeCollector
    );

    let totalWeight = BigNumber.from(0);
    for (let index = 0; index < users.length; index++) {
      const user = users[index];

      totalWeight = totalWeight.add(
        user.minterRewardWeight
          .add(user.debtFactor.mul(epochStartTime - user.lastDebtFactorSetTime))
          .sub(user.lastMinterRewardWeight)
      );
    }

    for (let tIndex = 0; tIndex < rewardTokens.length; tIndex++) {
      const rewardToken = rewardTokens[tIndex];
      const total = await feeCollectorContract.methods
        .getTotalDistributableRewards(rewardToken)
        .call();
      let index = 0;
      const perPage = 50;
      let minters = [];
      let amounts = [];

      while (index < users.length) {
        const user = users[index];
        minters.push(users[index].address);
        const userWeight = user.minterRewardWeight
          .add(user.debtFactor.mul(epochStartTime - user.lastDebtFactorSetTime))
          .sub(user.lastMinterRewardWeight);
        amounts.push(BigNumber.from(total).mul(userWeight).div(totalWeight));

        if (minters.length === perPage || index === users.length - 1) {
          const bulkIncreaseMinterRewards =
            feeCollectorContract.methods.bulkIncreaseMinterRewards(
              rewardToken,
              minters,
              amounts
            );
          const txObj = await bulkIncreaseMinterRewards.send({
            from: myAccount,
            gasLimit: 8000000,
            gasPrice,
          });
          console.log("Success!", txObj.transactionHash);
          minters = [];
          amounts = [];
        }
        index++;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchMintersInfo = async function (blockNumber) {
  var round = 0;
  var maxRound = 1; // look for maximum of 5000 accounts for now

  let data = { users: [] };

  try {
    const theGraphURL = getLiquidationSubgraphEndPoint();

    while (round < maxRound) {
      const users = (
        await axios.post(
          theGraphURL,
          {
            query: `query {
            users(first: 1000, where:{debtFactor_gt:1}, block: {number: ${blockNumber}}) {
              id
              address
    					lastDebtFactorSetTime
              minterRewardWeight
              lastMinterRewardWeight
              debtFactor
            }
          }`,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).data.data.users;
      users.forEach((user) => {
        data.users.push({
          address: user.address,
          lastDebtFactorSetTime: Number(user.lastDebtFactorSetTime),
          minterRewardWeight: BigNumber.from(user.minterRewardWeight),
          lastMinterRewardWeight: BigNumber.from(user.lastMinterRewardWeight),
          debtFactor: BigNumber.from(user.debtFactor),
        });
      });

      round++;
    }
    return data;
  } catch (error) {
    return data;
  }
};
