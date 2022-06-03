const { ethers, BigNumber } = require("ethers");

const calculateGasLimit = (estimatedGas) =>
  estimatedGas.mul(BigNumber.from(12)).div(BigNumber.from(10));

module.exports = {
  calculateGasLimit,
};
