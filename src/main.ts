import { ethers, Wallet } from "ethers";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/./../.env' });

const INFURA_PROVIDER_URL = process.env.INFURA_PROVIDER_URL ?? "ENV_ERROR";
const WALLET_SEED_PHRASE = process.env.WALLET_SEED_PHRASE ?? "ENV_ERROR";
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY ?? "ENV_ERROR";

const LIQUIDITY_POOL_ADDRESS = process.env.LIQUIDITY_POOL_ADDRESS ?? "ENV_ERROR";
const LIQUIDITY_POOL_ABI = process.env.LIQUIDITY_POOL_ABI ?? "ENV_ERROR";

const main = async () => {
  try {
    console.log("Starting bot")

    // Connect to mainnet (homestead) with infura URL
    const provider = new ethers.providers.JsonRpcProvider(INFURA_PROVIDER_URL);

    // Connect to wallet
    const wallet = new Wallet(WALLET_PRIVATE_KEY).connect(provider);
    // const wallet = Wallet.fromMnemonic(WALLET_SEED_PHRASE).connect(provider);
    const walletBalance = await wallet.getBalance()
    console.log(`Connected to wallet (${wallet.address}) - ETH balance: ${ethers.utils.formatEther(walletBalance)}`);

    // Create loop to check for LP address change for liquidity drip
    detectLiquidityPoolDrip();
  }
  catch (error) {
    console.log(error);
  }
}

const detectLiquidityPoolDrip = async () => {

  // Connect to mainnet (homestead) with infura URL
  const provider = new ethers.providers.JsonRpcProvider(INFURA_PROVIDER_URL);

  const lpContract = new ethers.Contract(LIQUIDITY_POOL_ADDRESS, LIQUIDITY_POOL_ABI, provider)
  const isDeployed = await lpContract.deployed();
  // console.log("🚀 ~ file: main.ts ~ line 39 ~ detectLiquidityPoolDrip ~ isDeployed", isDeployed)

  // const swapPrice = await lpContract.getSwapPrice();
  // console.log("🚀 ~ file: main.ts ~ line 41 ~ detectLiquidityPoolDrip ~ swapPrice", swapPrice)

  const isFinalized: boolean[] = await lpContract.functions.isFinalized();
  console.log("🚀 ~ file: main.ts ~ line 47 ~ detectLiquidityPoolDrip ~ isFinalized", isFinalized[0])
  const isPublicSwap: boolean[] = await lpContract.functions.isPublicSwap();
  console.log("🚀 ~ file: main.ts ~ line 52 ~ detectLiquidityPoolDrip ~ isPublicSwap", isPublicSwap[0])

  // Compare against existing pre balance to detect for drip then buy otherwise update prev
  if (!!isDeployed && isFinalized && isPublicSwap) {
    buy();
    return;
  }

  // Sleep 2 seconds then re-detect
  setTimeout(detectLiquidityPoolDrip, 2000);
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