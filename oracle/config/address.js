const { getNetwork } = require("./network");
const fujiAddresses = require("../config/fujiAddress");
const avaxAddresses = require("./avaxAddress");

function getAddresses() {
  const network = getNetwork();
  switch (network) {
    case "avax":
      return avaxAddresses;
    case "fuji":
      return fujiAddresses;
    default:
      console.log("Not supported network");
      return null;
  }
}

exports.getAddresses = getAddresses;
