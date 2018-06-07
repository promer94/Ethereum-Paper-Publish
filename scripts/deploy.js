require('dotenv').config();
const path = require('path');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const signale = require('signale');

const contractPath = path.resolve(__dirname, '../compiled/Car.json');
const _contractObject = require(contractPath);
const _interface = _contractObject.interface;
const { bytecode } = _contractObject;

const provider = new HDWalletProvider(
  process.env.SEEDPRASE,
  process.env.WEBACCESSPOINT
);

const web3 = new Web3(provider);

(async () => {
  signale.time('Deploy');
  const accounts = await web3.eth.getAccounts();
  signale.info(`Account:${accounts[0]}`);
  signale.pending('Deploying....');
  const result = await new web3.eth.Contract(JSON.parse(_interface))
    .deploy({
      data: bytecode,
      arguments: ['AUDI']
    })
    .send({
      from: accounts[0],
      gas: '1000000'
    });

  signale.success(`Contract has been depolyed:${result.options.address}`);
  signale.info(
    `You can view the transaction at https://rinkeby.etherscan.io/address/${
      result.options.address
    }`
  );
  signale.timeEnd('Deploy');
})();
