const { ethers, BigNumber } = require("ethers");

const calculateGasLimit = (estimatedGas) =>
  BigNumber.from(12).mul(estimatedGas).div(BigNumber.from(10));

module.exports = {
  calculateGasLimit,
};
