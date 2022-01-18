# Arable Validator Scripts

## Instructions for Beta Testnet Competition

### Prerequisites
To participate as a validator, you need to apply via the [Validator submission form](https://docs.google.com/forms/d/e/1FAIpQLSdwVNPok1yF9HDiJRg3ATbko-5i5UcQdf3w4X5yFDpuJlAP3A/viewform) and join the [beta testnet competition](https://docs.google.com/forms/d/1pRUTFO_4PqX7HB2PsYoFSNaZj-h3rUBOydy_2Xj3aWY/viewform?edit_requested=true).

Once you are approved, create a validator via [Arable protocol app](https://app.arablefi.com/admin/validator).

### Validator setup
To get the validator script up and running, follow [these instructions](https://github.com/ArableProtocol/arablevalidator/blob/main/validator.md). Running the validator script is required to collect any rewards.

## Install dependencies

Install node

```
node -v
v16.13.0
```

Install packages
`npm install`

Setting up ESLint

To automatically set ESLint to fix errors when you save the file. In Visual Studio Code, go to Settings -> Workspace and search for save, and click on "Edit in settings.json" and enter the following config:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript"]
}
```

VSCode Prettier configuration

```json
{
  "window.zoomLevel": 3,
  "go.useLanguageServer": true,
  "diffEditor.ignoreTrimWhitespace": false,
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.tabWidth": 2,
  "prettier.useTabs": false,
  "prettier.semi": true,
  "prettier.singleQuote": true,
  "editor.formatOnPaste": true,
  "prettier.requireConfig": false,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Script flow

Script has `collector` engine that collects information and put on state.
In the future, this state should be agreed by multiple validators on off-chain.
For changed state, it should be sumitted by `submitter` engine.

`collector` and `submitter` engines should work separately and should not depend on each other.
State is the way `collector` and `submitter` engines are connected each other.

## Execute the oracle script

Setup `.env` directory by referencing `env.example`.
Then execute `node oracle/index.js`

## Execute the token vesting script

Setup `.env` directory by referencing `env.example`.
Then execute `node tokenvesting/index.js`

## How to ensure the security of oracle script

Oracle script verification process

- Verified by the native chain members (developers / trusted parties)
- Verified by Arable protocol governance

To avoid the mismatch between oracle script and native chain information

- Beacon address will be available on native chain that is monitored
- If there's mismatch between beacon address and oracle script for more than the threshold, synthetic farm should be stopped
- To avoid mismatch, synthetic farm could use previous epoch's information on beacon address
- Another option is to let the native chain trusted parties to be the oracle provider by staking some of their tokens as collateral.

## Oracle security when oracle script itself is secure

- On testnet phase, the oracle script could rely on api services
- On mainnet phase, it should be fully decentralized and should be connecting to different nodes to collect information

At the first stage, internal oracles are acceptable for small farms but as time goes, oracle provider role should be delegated to third parties.
