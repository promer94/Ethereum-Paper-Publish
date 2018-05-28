const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');
const consola = require('consola')
//cleanup
const compiledDir = path.resolve(__dirname, '../compiled');
fs.removeSync(compiledDir);
fs.ensureDirSync(compiledDir);

//compile
const contractPath = path.resolve(__dirname, '../contracts', 'Car.sol');
const contractSource = fs.readFileSync(contractPath, 'utf-8');

const result = solc.compile(contractSource,1);

//check errors
if(Array.isArray(result.error) && result.error.length){
    throw new Error(result.errors[0])
}

//save to Disk
Object.keys(result.contracts).forEach(name => {
    const contractName = name.replace(/^:/, '');
    const filePath = path.resolve(__dirname, compiledDir,`${contractName}.json`);
    fs.outputJsonSync(filePath, result.contracts[name]);
    consola.success(`save compiled contract ${contractPath} to ${filePath}`);
    }   
)