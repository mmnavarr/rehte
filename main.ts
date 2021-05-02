import { BigNumber, ethers } from "ethers";

const INFURA_PROVIDER_URL = "https://mainnet.infura.io/v3/1bad90b90d4c4564aa8655b8e16017d0";
const LIQUIDITY_POOL_ADDRESS = "0x8B7D79a679c10bEd518fE905D764b4b7667f24de";

const main = () => {
  console.log("Starting bot")

  // Connect to wallet
  // connectToWallet();

  // Create loop to check for LP address change for liquidity drip
  detectLiquidityPoolDrip();
}

const connectToWallet = () => {
  console.log("Connecting to wallet");
  console.log(`Connected to public address: ${"XYZ"}`)
}

const detectLiquidityPoolDrip = async () => {
  // Connect to mainnet (homestead) with infura URL
  const provider = new ethers.providers.JsonRpcProvider(INFURA_PROVIDER_URL);

  let previousBalance = BigNumber.from(1) // Unset to actually detect change initial state

  const lpBalance = await provider.getBalance(LIQUIDITY_POOL_ADDRESS);
  console.log("🚀 ~ file: index.ts ~ line 21 ~ detectLiquidityPoolDrip ~ lpBalance", lpBalance)

  // Compare against existing pre balance to detect for drip then buy otherwise update prev
  if (previousBalance && lpBalance != previousBalance) {
    buy();
    // return;
  }
  else {
    previousBalance = lpBalance;
  }

  // Sleep 2 seconds then re-detect
  setTimeout(detectLiquidityPoolDrip, 2000)
}

const buy = () => {
  console.log("Buying into X from liquidity pool");

  // Prompt via CLI gas price and how many ETH?
  // Or pre-configure on code level?
}

// Documentation examples
const examples = async () => {

  // Connect to mainnet (homestead) with infura URL
  const provider = new ethers.providers.JsonRpcProvider(INFURA_PROVIDER_URL);

  // Look up the current block number
  const blockNumber = await provider.getBlockNumber();
  console.log("🚀 ~ file: index.ts ~ line 12 ~ main ~ blockNumber", blockNumber)

  // Get the balance of an account (by address or ENS name, if supported by network)
  const balance = await provider.getBalance(LIQUIDITY_POOL_ADDRESS);
  console.log("🚀 ~ file: index.ts ~ line 17 ~ main ~ balance", balance) // { BigNumber: "2337132817842795605" }

  // Convert from BigNumber to ether (instead of wei)
  const balanceFormatted = ethers.utils.formatEther(balance);
  console.log("🚀 ~ file: index.ts ~ line 24 ~ main ~ balanceFormatted", balanceFormatted); // '2.337132817842795605'
}

export default main;