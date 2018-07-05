const path = require('path');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const fs = require('fs-extra');

//1. Get bytecode
const contractPath = path.resolve(__dirname, '../compiled/Car.json');
const _contractObject = require(contractPath);
const _interface = _contractObject.interface;
const { bytecode } = _contractObject;

const logDir = path.resolve(__dirname, 'log/carlog');
fs.removeSync(logDir);
fs.ensureDirSync(logDir);

//2. config provider
const provider = ganache.provider({
  db_path: logDir
});
const web3 = new Web3(provider);
let accounts;
let contract;
const initialBrand = 'BWM';

describe('Contract: Car', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    contract = await new web3.eth.Contract(JSON.parse(_interface))
      .deploy({ data: bytecode, arguments: [initialBrand] })
      .send({ from: accounts[0], gas: '1000000' });
  });

  it('Deploy Car', () => {
    expect(contract.options.address).toBeDefined();
  });

  it('Has initial brand', async () => {
    expect.assertions(1);
    const brand = await contract.methods.brand().call();
    expect(brand).toEqual(initialBrand);
  });

  it('Can change the brand', async () => {
    expect.assertions(1);
    const newBrand = 'BWM';
    await contract.methods.setBrand(newBrand).send({ from: accounts[0] });
    const brand = await contract.methods.brand().call();

    expect(brand).toEqual(newBrand);
  });
});
