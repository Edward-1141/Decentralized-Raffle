// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// enable logging
import "hardhat/console.sol";

contract SimpleRaffle {
    // Events
    event RaffleEntered(address indexed participant, uint256 entryFee);
    event WinnerSelected(address indexed winner, uint256 prize, uint256 ownerShare);
    event EntryFeeChanged(uint256 oldEntryFee, uint256 newEntryFee);
    event MaxParticipantsChanged(uint256 oldMaxParticipants, uint256 newMaxParticipants);
    event EmergencyWithdraw(address indexed to, uint256 amount);

    address public owner;
    address[] private participants;
    address private recentWinner;
    uint public lastPrizePool;
    uint private constant WINNER_FEE = 90; // 90% of the prize pool
    uint public entryFee;
    uint public maxParticipants;
    bool private isSelectingWinner; // Reentrancy guard

    constructor(address _owner, uint _entryFee, uint _maxParticipants) {
        owner = _owner;
        entryFee = _entryFee;
        maxParticipants = _maxParticipants;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function enterRaffle() public payable {
        require(msg.value == entryFee, "Incorrect ETH amount");
        require(participants.length < maxParticipants, "Raffle is full");
        
        participants.push(msg.sender);
        emit RaffleEntered(msg.sender, msg.value);

        if (participants.length == maxParticipants) {
            selectWinner();
        }
    }

    function selectWinner() private {
        require(!isSelectingWinner, "Already selecting winner");
        isSelectingWinner = true;
        
        // Currently ignore the insecure randomess problem
        uint randomIndex = uint(keccak256(abi.encodePacked(block.timestamp, participants))) % participants.length;
        recentWinner = participants[randomIndex];
        
        // Calculate amounts before any state changes
        uint totalBalance = address(this).balance;
        uint prize = (totalBalance * WINNER_FEE) / 100;
        uint ownerShare = totalBalance - prize;
        
        // Reset state before external calls
        participants = new address[](0);
        lastPrizePool = prize;
        
        // Send prize to winner
        (bool success, ) = payable(recentWinner).call{value: prize}("");
        require(success, "Transfer to winner failed");
        
        // Send remaining balance to owner
        (success, ) = payable(owner).call{value: ownerShare}("");
        require(success, "Transfer to owner failed");
        
        emit WinnerSelected(recentWinner, prize, ownerShare);
        isSelectingWinner = false;
    }

    function getParticipants() public view returns (address[] memory) {
        return participants;
    }

    function getRecentWinner() public view returns (address) {
        return recentWinner;
    }

    function getPrizePool() public view returns (uint) {
        // current prize pool for future winners
        return (address(this).balance * WINNER_FEE) / 100;
    }

    // owner are allowed to change the entry fee and max participants when the raffle is not in progress (no participants)
    function changeEntryFee(uint newEntryFee) public onlyOwner {
        require(participants.length == 0, "Raffle is in progress");
        uint oldEntryFee = entryFee;
        entryFee = newEntryFee;
        emit EntryFeeChanged(oldEntryFee, newEntryFee);
    }

    function changeMaxParticipants(uint newMaxParticipants) public onlyOwner {
        require(participants.length == 0, "Raffle is in progress");
        uint oldMaxParticipants = maxParticipants;
        maxParticipants = newMaxParticipants;
        emit MaxParticipantsChanged(oldMaxParticipants, newMaxParticipants);
    }

    // Emergency withdrawal function for owner
    function emergencyWithdraw() public onlyOwner {
        require(participants.length == 0, "Cannot withdraw while raffle is in progress");
        uint balance = address(this).balance;
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Transfer failed");
        emit EmergencyWithdraw(owner, balance);
    }

    // Allow contract to receive ETH
    receive() external payable {}
}