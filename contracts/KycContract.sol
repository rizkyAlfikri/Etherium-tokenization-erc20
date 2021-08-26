// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KycContract is Ownable {
    mapping(address => bool) allowed;

    event KycStatus(bool kycStatus);

    function setKycCompleted(address _addrs) public onlyOwner {
        allowed[_addrs] = true;
    }

    function setKycRevoked(address _addres) public onlyOwner {
        allowed[_addres] = false;
    }

    function kycCompleted(address _addrs) public view returns (bool) {
        return allowed[_addrs];
    }

    function checkKycStatus(address _addrs) public {
        emit KycStatus(allowed[_addrs]);
    }
}
