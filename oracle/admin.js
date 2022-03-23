const { setAllowedProvider } = require('./utils/index.js');

async function bulkPermitAllowedProviders() {
  let oracleFeeders = [
    '0xf4eD87a5BDa4DdAc51FA66445a5c52D1cc80eC0C',
    '0x5c63b54e8049e5B12e8B14c46dcc06E0A052f6F9',
    '0x53F59a0137e98bbd8664A9A4dfE5c9f331d6E038',
    '0x1Bc6da4c30fc38B9220d162CeC11F9EC5D14147c',
    '0x0E905dB8C6E27Fed963E34E13787374F125911fD',
    '0x14aEE6d2BaC52976dAA1F685a30C6d3c4bFe7F7C',
    '0x8c167c165a44ae110ca1e69a3c80b33303e93b10',
  ];

  for (let i = 0; i < oracleFeeders.length; i++) {
    await setAllowedProvider(oracleFeeders[i]);
  }
}

bulkPermitAllowedProviders();
