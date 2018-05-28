const path = require('path');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const consola = require('consola');

//1. Get bytecode
const contractPath = path.resolve(__dirname, '../compiled/Car.json');
const { interface, bytecode } = require(contractPath);

//2. config provider
const web3 = new Web3(ganache.provider());

let account;
let contract;
const initialBrand = 'BWM';

describe('contract',() => {
    beforeEach(async ()=>{
        accounts = await web3.eth.getAccounts();

        contract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [initialBrand]})
        .send({from:accounts[0], gas:'1000000'});

        consola.success(`Account:${accounts[0]}`)
        consola.success(`Contracts have been deployed at ${contract.options.address}`)

        
    })
    it('deploy a contact', () => {
        assert.ok(contract.options.address);
    });

    it('has initial brand', async () => {
        const brand = await contract.methods.brand().call();
        assert.equal(brand, initialBrand)
    });
    
    it('can change the brand', async () => {
        const newBrand = 'ZZZ';
        await contract.methods.setBrand(newBrand).send({from:accounts[0]});
        const brand = await contract.methods.brand().call();
        assert.equal(brand, newBrand);
    })
})