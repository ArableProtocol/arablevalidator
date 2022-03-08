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

This is for future use and you can leave it empty for now.

```
nano .env
```

For security reasons, change the permission of `.env`to readonly:

```
chmod 400 .env
```

## Running the validator

To run the validator in the background, daemonize the `tokenvesting` script:

```
pm2 start npm -- run tokenvesting --
```

Verify that the script is running successfully in the background:

```
pm2 list
pm2 logs 0
```

To update to the most recent version of the script and restart the daemon:

```
git pull
pm2 restart 0
```

Make sure to check `env.example` for any changes that need to be made to your `.env`file.

To stop the daemonized validator script:

```
pm2 stop 0
```

# Notes:

- The validator script performs transactions on the Avalanche network. Make sure to keep an AVAX balance in your account to cover transaction costs.
- For security reasons, keep only a small balance of AVAX in the account.
- As a validator, you are responsible for keeping your server secure.
