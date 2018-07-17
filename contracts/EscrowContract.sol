pragma solidity ^0.4.24;

contract EscrowContract {
    address public depositor;
    address public beneficiary;
    address public arbiter;
    event Approved(uint256 a);
    constructor (address _arbiter, address _beneficiary) public payable{
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
    }
    function approve () public payable {
        require(msg.sender == arbiter);
        emit Approved(address(this).balance);
        beneficiary.transfer(address(this).balance);
    } 
}