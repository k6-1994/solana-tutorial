import { Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// Parse the command line parameters
const suppliedPublicKey = process.argv[2];
if (!suppliedPublicKey) 
{
  console.log("Please supply a public key to check the balance of");
  process.exit(-1);
}

let publicKey = null;
try 
{
  publicKey = new PublicKey(suppliedPublicKey);
}
catch (e)
{
  console.log("Invalid public key");
  process.exit(-1);
}

let apiUrl = "https://api.devnet.solana.com";

const netToConnect = process.argv[3];
if(netToConnect)
{
  try
  {
    apiUrl = clusterApiUrl(netToConnect, true);
  }
  catch(e)
  {
    console.log("Specified network unrecognized.  Defaulting to devnet.")
  }
}

// Connect to network
const connection = new Connection(apiUrl, "confirmed");

const balanceInLamports = await connection.getBalance(publicKey);
const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(`💰 Finished! The balance for the wallet on ${apiUrl} at address ${publicKey} is ${balanceInSOL}!`);