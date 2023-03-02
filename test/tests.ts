const { expect } = require("chai");
const { ethers, network } = require("hardhat");


describe("BuyMeACoffe contract", function () {
  let buyMeACoffeContract;
  let buyMeACoffe;
  let owner;
  let contract_owner;
  let signer1;
  let provider;

  beforeEach(async () => {
    [owner, signer1] = await ethers.getSigners();
    buyMeACoffeContract = await ethers.getContractFactory("BuyMeACoffe", owner);
    contract_owner = await ethers.getSigner(network.config.from);
    buyMeACoffe = await buyMeACoffeContract.deploy();
    await buyMeACoffe.deployed();
  });

  describe("Deployment", () => {

    it("Should set the right owner", async function () {
      expect(contract_owner.address).to.equal(owner.address);
      expect(await buyMeACoffe.owner()).to.equal(owner.address);
    });
  });

  describe("Buy coffe", () => {
    it("Revert with 0 ether msg.value", async function() {
      await expect(buyMeACoffe.buyCoffe("Viktor", "test coffe")).to.be.revertedWith("cant buy coffe with 0 eth")
    });

    it("check memos length after coffe buy", async function() {
      const transferAmount = ethers.utils.parseEther("2");
      const data = {value: transferAmount};

      await buyMeACoffe.connect(owner).buyCoffe("Viktor", "test coffe", data)

      let memos = await buyMeACoffe.getMemos()
      expect(memos.length).to.equal(1)
    });
  });

  describe("withdraw tips", () => {
    it("non owner", async function() {
      await expect(buyMeACoffe.connect(signer1).withdrawTips()).to.be.revertedWith("You are not the owner.")
    });

    it("owner", async function() {
      let transaction;
      let receipt;

      const transferAmount1 = ethers.utils.parseEther("2");
      const transferAmount2 = ethers.utils.parseEther("3");
      const transferAmount3 = ethers.utils.parseEther("4");
      const data1 = {value: transferAmount3};
      const data2 = {value: transferAmount1};
      const data3 = {value: transferAmount2};

      await buyMeACoffe.connect(signer1).buyCoffe("Viktor", "test coffe 1", data1)
      await buyMeACoffe.connect(signer1).buyCoffe("Viktor", "test coffe 2", data2)
      await buyMeACoffe.connect(signer1).buyCoffe("Viktor", "test coffe 3", data3)

      const signerBalanceBefore = await ethers.provider.getBalance(owner.address);

      transaction = await buyMeACoffe.connect(owner).withdrawTips()
      receipt = await transaction.wait()

      const gasUsed = BigInt(receipt.cumulativeGasUsed) * BigInt(receipt.effectiveGasPrice);
      const signerBalanceAfter = await  ethers.provider.getBalance(owner.address);

      expect(signerBalanceAfter).to.equal(
            signerBalanceBefore
            .sub(gasUsed)
            .add(transferAmount1).add(transferAmount2).add(transferAmount3)
        )


    });

  });
});
