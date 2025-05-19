// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// enable logging
import "hardhat/console.sol";

contract SimpleRaffle {
    address public owner;
    address[] private participants;
    address private recentWinner;
    uint public lastPrizePool;
    uint private constant WINNER_FEE = 90;
    uint public constant ENTRY_FEE = 0.01 ether;
    uint public constant MAX_PARTICIPANTS = 10;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function enterRaffle() public payable {
        require(msg.value == ENTRY_FEE, "Incorrect ETH amount");
        if (msg.value == ENTRY_FEE){
            participants.push(msg.sender);
        }

        if (participants.length == MAX_PARTICIPANTS) {
            selectWinner();
        }
    }

    function selectWinner() private {
        uint randomIndex = uint(keccak256(abi.encodePacked(block.timestamp, participants))) % participants.length;
        recentWinner = participants[randomIndex];
        uint totalBalance = address(this).balance;
        uint prize = totalBalance * WINNER_FEE / 100;
        uint ownerShare = totalBalance - prize;
        
        // Send prize to winner
        payable(recentWinner).transfer(prize);
        // Send remaining balance to owner
        payable(owner).transfer(ownerShare);
        
        participants = new address[](0);
        lastPrizePool = prize;
    }

    function getParticipants() public view returns (address[] memory) {
        return participants;
    }

    function getRecentWinner() public view returns (address) {
        return recentWinner;
    }

    function getPrizePool() public view returns (uint) {
        // current prize pool for future winners
        return address(this).balance * WINNER_FEE / 100;
    }
}