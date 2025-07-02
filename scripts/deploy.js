// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const Vaultify = await hre.ethers.getContractFactory("Vaultify");
  const vaultify = await Vaultify.deploy();

  await vaultify.waitForDeployment();

  console.log(`✅ Vaultify deployed at: ${vaultify.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
