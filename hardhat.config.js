require('@nomiclabs/hardhat-waffle');

const fs = require('fs');
const privateKey = fs.readFileSync('.secret').toString();

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/Y22AtIifTIpHDxWiYaiCZUSbcllJEo5E',
      accounts: [privateKey],
    },
    mainnet: {
      url: 'https://polygon-mainnet.g.alchemy.com/v2/pUweezjH2rs8MAmOwW6m8g_tDM1oX34Z',
      accounts: [privateKey],
    },
  },
  solidity: '0.8.4',
};
