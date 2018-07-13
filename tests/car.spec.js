const path = require('path');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const fs = require('fs-extra');
const winston = require('winston');
//1. Get bytecode
const contractPath = path.resolve(__dirname, '../compiled/Car.json');
const _contractObject = require(contractPath);
const _interface = _contractObject.interface;
const { bytecode } = _contractObject;

const logDir = path.resolve(__dirname, 'log/carlog');
fs.removeSync(logDir);
fs.ensureDirSync(logDir);

// Set logger
const blockLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({
      filename: `${logDir}/Car.log`,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    })
  ]
});
blockLogger.log = blockLogger.info;

//2. config provider
const provider = ganache.provider({
  logger: blockLogger
});
//3. Initialize web3 instance
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
