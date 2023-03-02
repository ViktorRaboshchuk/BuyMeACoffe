import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config()


const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: process.env.STAGING_QUICK_NODE || "http://127.0.0.1",
      accounts: [process.env.METAMASK_PRIVATE_KEY as string || "0x0000000000000000000000000000000000000000000000000000000000000000"]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};


export default config;
