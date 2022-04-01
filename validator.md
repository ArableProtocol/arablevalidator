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

Clone the validator project and install required npm dependencies:

```
git clone https://github.com/ArableProtocol/arablevalidator
cd ./arablevalidator
npm install
```

## Configure the environment variables

Navigate to the `arablevalidator` directory and duplicate the example configuration file:

```
cp env.example .env
```

Open `.env` in your favorite editor and set all variables:

#### PRIVATE_KEY

Provide the private key of a wallet address you want to use to fund any transaction costs while running the validator. Please ensure it contains enough AVAX.
The private key is never transmitted outside the server and is only used to cover the mentioned transaction costs.

#### CHAIN_ID

The chain ID the validator will run on. The chain ID for Avalanche Mainnet C-Chain is `43114`. For FUJI Testnet it is `43113`.

#### VALIDATOR_ADDRESS

Provide the contract address for your validator. You can find it by going to https://app.arable.finance/#/admin/validator and checking the 'Member' address. If you have not registered your validator yet, click on `+Create Validator` to see your 'Member' contract address.

#### IS_PRIMARY_FULL_NODE

This is for full node configuration that is run by internal team. Validators are not running this to reduce gas fee.

```
nano .env
```

For security reasons, change the permission of `.env`to readonly:

```
chmod 400 .env
```

## Running one-time full node when full node is not executed for the epoch

Run

```
node tokenvesting/full-node-once.js
```

with below configuration

```
VALIDATOR_ADDRESS="YOUR_VALIDATOR"
CHAIN_ID=43114
PRIVATE_KEY="ACCOUNT_PRIVATE_KEY_WITH_AVAX_FEE"
```

## Running the validator

To run the validator in the background, daemonize the `tokenvesting` script:

```
pm2 start tokenvesting -- run tokenvesting --
```

Verify that the script is running successfully in the background:

```
pm2 list
pm2 logs tokenvesting
```

To update to the most recent version of the script and restart the daemon:

```
git pull
pm2 restart tokenvesting
```

Make sure to check `env.example` for any changes that need to be made to your `.env`file.

To stop the daemonized validator script:

```
pm2 stop tokenvesting
```

### Running mvp testnet scripts

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
CHAIN_ID=43113
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
CHAIN_ID=43113
```

```
pm2 start liquidator -- run liquidator --
pm2 logs liquidator
pm2 restart liquidator
pm2 stop liquidator
```

#### arUSD stability script

`arUSD` stability script periodically (per 60s) check arUSD price on Pangolin's arUSD/USDT pair and maintains the price to be between 0.98 - 1.02.
Please ensure to set `PRIVATE_KEY` with the address that holds arUSD and USDT - and if does not hold those tokens, script won't run.
Please use a unique address per script. It shouldn't be same as tokenvesting, oracle, or arUSD stability script `PRIVATE_KEY`.

```
git clone https://github.com/ArableProtocol/arablevalidator arusdstability
cd arusdstability
npm install
nano .env
```

```
PRIVATE_KEY="" # Configure private key for the script
VALIDATOR_ADDRESS=""
CHAIN_ID=43113
```

```
pm2 start arusdstability -- run arusdstability --
pm2 logs arusdstability
pm2 restart arusdstability
pm2 stop arusdstability
```

# Notes:

- The validator script performs transactions on the Avalanche network. Make sure to keep an AVAX balance in your account to cover transaction costs.
- For security reasons, keep only a small balance of AVAX in the account.
- As a validator, you are responsible for keeping your server secure.
