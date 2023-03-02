const hre = require("hardhat");

async function main() {
  const BuyMeACoffe = await hre.ethers.getContractFactory("BuyMeACoffe");
  const buyMeACoffe = await BuyMeACoffe.deploy();
  await buyMeACoffe.deployed();

  console.log("Contract address:", buyMeACoffe.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
