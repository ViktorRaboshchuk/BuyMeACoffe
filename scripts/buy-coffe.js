const hre = require("hardhat");
const { ethers } = hre;


async function getBalance(address) {
  const balanceBigInt = await ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance:`, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper}, (${tipperAddress}) said: "${message}"`);
  }
}

async function main(){
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  const BuyMeACoffe = await hre.ethers.getContractFactory("BuyMeACoffe");
  const buyMeACoffe = await BuyMeACoffe.deploy();
  await buyMeACoffe.deployed();

  console.log("Contract address:", buyMeACoffe.address);

  const addresses = [owner.address, tipper1.address, buyMeACoffe.address];
  console.log("== start ==");
  await printBalances(addresses);

  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffe.connect(tipper1).buyCoffe("Viktor1", "Coffe1", tip);
  await buyMeACoffe.connect(tipper2).buyCoffe("Viktor2", "Coffe2", tip);
  await buyMeACoffe.connect(tipper3).buyCoffe('Viktor3', "Coffe3", tip);
  console.log("== start ==");
  await printBalances(addresses);

  await buyMeACoffe.withdrawTips();
  console.log("== start ==");
  await printBalances(addresses);

  console.log("== memos ==");
  const memos = await buyMeACoffe.getMemos();
  printMemos(memos);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
