const { BigNumber, utils } = require('ethers');

const { formatUnits } = utils;

const numberWithCommas = (x) => {
  const splits = x.toString().split('.');
  const first = splits[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (splits.length === 1) return first;
  return [first, splits[1]].join('.');
};

exports.formatBigNumber = function (value, decimals, precision) {
  return numberWithCommas(
    Number(formatUnits(value, decimals)) < 0.01 &&
      Number(formatUnits(value, decimals)) != 0
      ? Number(formatUnits(value, decimals)).toFixed(precision).toString()
      : Number(formatUnits(value, decimals)).toFixed(2).toString()
  );
};
