pragma solidity ^0.4.24;

contract EscrowContract {
    address public depositor;
    address public beneficiary;
    address public arbiter;
    constructor (address _arbiter, address _beneficiary) public payable{
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
    }
    function approve () public payable {
        require(msg.sender == arbiter);
        beneficiary.transfer(address(this).balance);
    } 
}