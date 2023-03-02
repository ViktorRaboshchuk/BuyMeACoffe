// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract BuyMeACoffe {
  // Event to emit when a Memo is created
  event NewMemo(
    address from,
    uint256 timestamp,
    string name,
    string message
    );

  // Memo struct
  struct Memo {
    address from;
    uint256 timestamp;
    string name;
    string message;
  }

  // list of all memos
  Memo[] memos;

  address payable public owner;

  constructor() {
    owner = payable(msg.sender);
  }

  function buyCoffe(string memory _name, string memory _message) public payable {
    require(msg.value > 0, "cant buy coffe with 0 eth");

    memos.push(Memo(msg.sender, block.timestamp, _name, _message));
    /* console.log(memos[0].from); */

    emit NewMemo(msg.sender, block.timestamp, _name, _message);
  }

  function withdrawTips() public {
    require(msg.sender == owner, "You are not the owner.");
    (bool success, ) = owner.call{value: address(this).balance}("");

  }

  function getMemos() public view returns(Memo[] memory){
    return memos;

  }
}
