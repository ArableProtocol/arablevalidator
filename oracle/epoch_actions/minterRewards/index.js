const { waitSeconds } = require("../../../utils/wait");
const { fee_collector_abi } = require("../abi/fee_collector_abi");
var axios = require("axios");
const { BigNumber } = require("ethers");
const { getAddresses } = require("../../config/address");
const { setup } = require("../../config/network");

const web3 = setup();

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
      console.log("Success!", txObj.transactionHash);
      const txReceipt = await web3.eth.getTransaction(txObj.transactionHash);
      await waitSeconds(30);
      await increaseMinterRewards(txReceipt.blockNumber);
      return txObj.transactionHash;
    }

    // Execute once per 8 hrs - only by oracle providers
    // function startNewEpoch() public override onlyAllowedProvider
    // Should check if it's going to reverted and if so should stop
  } catch (error) {
    console.log(error);
  }
};

const increaseMinterRewards = async function (blockNumber) {
  try {
    const { ACRE, feeCollector } = await getAddresses();

    console.log(`==increaseMinterRewards at block: ${blockNumber}==`);
    // TODO: implement!
    // run 30 mins after increasing epoch
    // epochDistributableAmount can be fetched on TheGraph
    // Event is emited when starting new epoch - emit SetEpochTokenRewards(epochNumber, rewardToken, getTotalDistributableRewards(rewardToken));
    // function increaseMinterRewards(address minter, address rewardToken, uint256 amount)
    // minterRewardAmount = epochDistributableAmount * _debtFactor /  _totalDebtFactor
    // Once per epoch - fine to run twice - next ones rejected
    // Should check if it's going to reverted and if so should stop
    const rewardTokens = [ACRE];

    const { users, totalDebtFactor } = await fetchMintersInfo(blockNumber);

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

    for (let tIndex = 0; tIndex < rewardTokens.length; tIndex++) {
      const rewardToken = rewardTokens[tIndex];
      const total = await feeCollectorContract.methods
        .getTotalDistributableRewards(rewardToken)
        .call();
      let index = 0;
      const perPage = 20;
      while (index < users.length) {
        let minters = [];
        let amounts = [];
        minters.push(users[index].address);
        amounts.push(
          BigNumber.from(total)
            .mul(users[index].debtFactor)
            .div(totalDebtFactor)
        );
        if (minters.length === perPage || index === users.length - 1) {
          const bulkIncreaseMinterRewards =
            feeCollectorContract.methods.bulkIncreaseMinterRewards(
              rewardToken,
              minters,
              amounts
            );
          const txObj = await bulkIncreaseMinterRewards.send({
            from: myAccount,
            gasLimit: 1000000,
            gasPrice,
          });
          console.log("Success!", txObj.transactionHash);
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

  let data = { users: [], totalDebtFactor: BigNumber.from(0) };

  try {
    // https://thegraph.com/hosted-service/subgraph/arableprotocol/arable-liquidation-fuji
    const theGraphURL =
      "https://api.thegraph.com/subgraphs/name/arableprotocol/arable-liquidation-fuji";

    const globalInfos = (
      await axios.post(
        theGraphURL,
        {
          query: `query {
          globalInfos(first: 1, block:{number: ${blockNumber}}) {
            totalDebtFactor
          }
        }`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    ).data.data;

    // TODO: get both accounts and global queries as well from the query
    console.log(`fetching unhealthy accounts`);

    data.totalDebtFactor = BigNumber.from(
      globalInfos.globalInfos[0].totalDebtFactor
    );

    while (round < maxRound) {
      const users = (
        await axios.post(
          theGraphURL,
          {
            query: `query {
            users(first: 1000, where:{debtFactor_gt:1}, block: {number: ${blockNumber}}) {
              id
              address
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
          debtFactor: BigNumber.from(user.debtFactor),
        });
      });

      round++;
    }
    return {
      flaggableAccounts: totalFlaggableAccounts,
      liquidatableAccounts: totalLiquidatableAccounts,
    };
  } catch (error) {
    return data;
  }
};
