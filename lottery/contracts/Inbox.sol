pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        players.push(msg.sender);
    }

    // function pickWinner() public {}
}
