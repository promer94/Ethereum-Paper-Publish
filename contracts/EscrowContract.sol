pragma solidity ^0.4.24;// TODO: declare version ^0.4.19

contract EscrowContract {
	  // TODO: create member variables
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