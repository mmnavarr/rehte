import { ethers, Wallet } from "ethers";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/./../.env' });

const INFURA_PROVIDER_URL = process.env.INFURA_PROVIDER_URL ?? "ENV_ERROR";
const WALLET_SEED_PHRASE = process.env.WALLET_SEED_PHRASE ?? "ENV_ERROR";
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY ?? "ENV_ERROR";

const LIQUIDITY_POOL_ADDRESS = process.env.LIQUIDITY_POOL_ADDRESS ?? "ENV_ERROR";
const LIQUIDITY_POOL_ABI = process.env.LIQUIDITY_POOL_ABI ?? "ENV_ERROR";

let provider;
let wallet;

const main = async () => {
  try {
    console.log("Starting bot")

    // Connect to mainnet (homestead) with infura URL
    provider = new ethers.providers.JsonRpcProvider(INFURA_PROVIDER_URL);

    // Connect to wallet
    wallet = new Wallet(WALLET_PRIVATE_KEY).connect(provider);
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
  // Infinitely loop until balancer LDB is ready for purchase
  const forever = true;
  while (forever) {
    const lpContract = new ethers.Contract(LIQUIDITY_POOL_ADDRESS, LIQUIDITY_POOL_ABI, provider)
    const isDeployed = await lpContract.deployed();
    // console.log("🚀 ~ file: main.ts ~ line 39 ~ detectLiquidityPoolDrip ~ isDeployed", isDeployed)

    const isFinalized: boolean = (await lpContract.functions.isFinalized())[0];
    const isPublicSwap: boolean = (await lpContract.functions.isPublicSwap())[0];

    if (!!isDeployed && isFinalized && isPublicSwap && !forever) {
      buy();
      return;
    }
  }
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