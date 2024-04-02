import { Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import {getHashedName, getNameAccountKey, NameRegistryState } from "@bonfida/spl-name-service";

// Parse the command line parameters
const suppliedPublicKey = process.argv[2];
if (!suppliedPublicKey) 
{
  console.log("Please supply a public key to check the balance of");
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

// Check if the supplied key is a ".sol" domain that needs to be resolved
let resolvedPublicKey = suppliedPublicKey;
if(suppliedPublicKey.search(new RegExp("\.sol$", "gi")) != -1)
{
  const hashedName = await getHashedName(resolvedPublicKey.replace(".sol", ""));
  const nameAccountKey = await getNameAccountKey(
    hashedName,
    undefined,
    new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
  );
  const owner = await NameRegistryState.retrieve(
    connection,
    nameAccountKey
  );
  
  resolvedPublicKey = owner.registry.owner;
  console.log(`Resolved public key: ${resolvedPublicKey}`);
}

let publicKey = null;
try 
{
  publicKey = new PublicKey(resolvedPublicKey);
}
catch (e)
{
  console.log("Invalid public key");
  process.exit(-1);
}

const balanceInLamports = await connection.getBalance(publicKey);
const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(`💰 Finished! The balance for the wallet on ${apiUrl} at address ${publicKey} is ${balanceInSOL}!`);