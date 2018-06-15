const path = require('path');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const fs = require('fs-extra');
const assert = require('assert');

//1. Get bytecode
const contractPath = path.resolve(__dirname, '../compiled/EscrowContract.json');
const _contractObject = require(contractPath);
const _interface = _contractObject.interface;
const { bytecode } = _contractObject;

const logDir = path.resolve(__dirname, 'log/EscrowContractLog');
fs.removeSync(logDir);
fs.ensureDirSync(logDir);

//2. config provider
const provider = ganache.provider({
  db_path: logDir
});
const web3 = new Web3(provider);
let accounts;
let contract;
let initialBalance;
const BN = web3.utils.BN; //eslint-disable-line
const initialInvest = new BN(web3.utils.toWei('1', 'ether'));

describe('Contract: EscrowContract', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    const _depositor = accounts[0];
    const _arbiter = accounts[1];
    const _beneficiary = accounts[2];
    initialBalance = new BN(await web3.eth.getBalance(accounts[2]));
    contract = await new web3.eth.Contract(JSON.parse(_interface))
      .deploy({ data: bytecode, arguments: [_arbiter, _beneficiary] })
      .send({
        from: _depositor,
        gas: '1000000',
        gasPrice: 0,
        value: initialInvest
      });
  });

  describe('Constructor Stage tests', () => {
    it('Deploy a contact', () => {
      expect(contract.options.address).toBeDefined();
    });

    it('should set an arbiter', async () => {
      expect.assertions(1);
      const arbiter = await contract.methods.arbiter().call();
      expect(arbiter).toEqual(accounts[1]);
    });

    it('should set an depositor', async () => {
      expect.assertions(1);
      const depositor = await contract.methods.depositor().call();
      expect(depositor).toEqual(accounts[0]);
    });

    it('should set an beneficiary', async () => {
      expect.assertions(1);
      const beneficiary = await contract.methods.beneficiary().call();
      expect(beneficiary).toEqual(accounts[2]);
    });
  });

  describe('Fund Stage tests', () => {
    it('should be funded', async () => {
      expect.assertions(1);
      const balance = new BN(
        await web3.eth.getBalance(contract.options.address)
      );
      expect(balance).toStrictEqual(initialInvest);
    });
  });

  describe('Approve Stage tests', () => {
    it('should allow arbiter to approve', async () => {
      expect.assertions(2);
      const approve = await contract.methods
        .approve()
        .send({ from: accounts[1] });
      const balance = new BN(await web3.eth.getBalance(accounts[2]));
      expect(approve).toBeTruthy();
      expect(balance).toStrictEqual(initialBalance.add(initialInvest));
    });

    it('should not allow anyone but the arbiter to approve', async () => {
      await expectThrow(contract.methods.approve().send({ from: accounts[2] }));
    });
  });
});

async function expectThrow(promise) {
  const errMsg = 'Expected throw not received';
  try {
    await promise;
  } catch (err) {
    assert(err.toString().includes('revert'), errMsg);
    return;
  }

  assert.fail(errMsg);
}
