// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract NumberGuessingGame {
    address public owner;
    uint256 private constant MIN_BET = 0.01 ether;
    uint256 private constant MAX_NUMBER = 10;
    uint256 private constant PRIZE_MULTIPLIER = 2; // Winner gets 2x their bet
    
    event GameResult(
        address indexed player,
        uint256 playerGuess,
        uint256 correctNumber,
        bool won
    );
    
    constructor() {
        owner = msg.sender;
    }
    
    // Generate a pseudo-random number between 1 and MAX_NUMBER
    function _generateRandomNumber() private view returns (uint256) {
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    address(this).balance
                )
            )
        ) % MAX_NUMBER;
        
        return randomNumber + 1; // Ensure number is between 1 and MAX_NUMBER
    }
    
    // Play the game by guessing a number
    function play(uint256 _guess) external payable {
        require(msg.value >= MIN_BET, "Minimum bet is 0.01 ETH");
        require(_guess > 0 && _guess <= MAX_NUMBER, "Guess must be between 1 and 10");
        
        uint256 correctNumber = _generateRandomNumber();
        bool won = (_guess == correctNumber);
        
        emit GameResult(msg.sender, _guess, correctNumber, won);
        
        if (won) {
            // Pay out the prize
            uint256 prize = msg.value * PRIZE_MULTIPLIER;
            require(address(this).balance >= prize, "Insufficient contract balance");
            
            (bool success, ) = payable(msg.sender).call{value: prize}("");
            require(success, "Failed to send prize");
        }
    }
    
    // Allow the owner to withdraw funds
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Allow the contract to receive ETH
    receive() external payable {}
}

