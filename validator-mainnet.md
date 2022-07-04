# Setup

Below you find the required steps to set up and start the validator script on an Ubuntu server.

## Installation

Install Node and dev dependencies:

```
sudo apt update
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt -y install nodejs
sudo apt -y install gcc g++ make git build-essential
```

Install the [PM2 npm package](https://pm2.keymetrics.io/), a daemon process manager:

```
npm install -g pm2
```

### Running mvp mainnet scripts

#### Setup mvp folder

mkdir mvp
cd mvp

#### Oracle script

On oracle, it is needed to fetch on-chain data from mainnet of other networks and need to configure RPC urls.
Please ensure to set `PRIVATE_KEY` with the address that is allowed to feed the oracle.
Please use a unique address per script.

```
git clone https://github.com/ArableProtocol/arablevalidator oracle
cd oracle
npm install
nano .env
```

```
ETH_RPC="https://mainnet.infura.io/v3/..."
MATIC_RPC="https://polygon-mainnet.g.alchemy.com/v2/..."
PRIVATE_KEY="" # Configure private key for the script
VALIDATOR_ADDRESS=""
CHAIN_ID=43114
```

```
pm2 start oracle -- run oracle --
pm2 logs oracle
pm2 restart oracle
pm2 stop oracle
```

#### Liquidator script

Liquidation script periodically (per 60s) fetch unhealthy accounts and liquidate.
Please ensure to set `PRIVATE_KEY` with the address that holds arUSD - and if does not hold it, script won't run.
Please use a unique address per script. It shouldn't be same as tokenvesting, oracle, or arUSD stability script `PRIVATE_KEY`.

```
git clone https://github.com/ArableProtocol/arablevalidator liquidator
cd liquidator
npm install
nano .env
```

```
PRIVATE_KEY="" # Configure private key for the script
VALIDATOR_ADDRESS=""
CHAIN_ID=43114
```

```
pm2 start liquidator -- run liquidator --
pm2 logs liquidator
pm2 restart liquidator
pm2 stop liquidator
```

# Notes:

- The validator script performs transactions on the Avalanche network. Make sure to keep an AVAX balance in your account to cover transaction costs.
- For security reasons, keep only a small balance of AVAX in the account.
- As a validator, you are responsible for keeping your server secure.
