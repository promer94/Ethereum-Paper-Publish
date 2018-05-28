require('dotenv').config();
const path = require('path');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const consola = require('consola');

const contractPath = path.resolve(__dirname, '../compiled/Car.json');
const _contractObject = require(contractPath);
const _interface = _contractObject['interface']
const bytecode = _contractObject['bytecode']


const provider = new HDWalletProvider(
    process.env.SEEDPRASE,
    process.env.WEBACCESSPOINT
)

const web3 = new Web3(provider);

(async () => {
    console.time('Deployment time')
    const accounts = await web3.eth.getAccounts();
    consola.info(`Account:${accounts[0]}`);

    consola.start('Deployment start')
    
    const result = await new web3.eth.Contract(JSON.parse(_interface))
    .deploy({data: bytecode, arguments:['AUDI']})
    .send({from: accounts[0], gas:'1000000'})
    

    consola.success(`Contract has been depolyed:${result.options.address}`)
    console.timeEnd('Deployment time')
})()