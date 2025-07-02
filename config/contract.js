import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Required because __dirname is not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const provider = new ethers.JsonRpcProvider(process.env.INFURA_API);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load compiled contract ABI
const contractPath = path.resolve(__dirname, '../artifacts/contracts/Vaultify.sol/Vaultify.json');
const contractJSON = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

const contractAddress = '0x019654E58f4B3D20058Be2D68a673F79177158F1';
const contract = new ethers.Contract(contractAddress, contractJSON.abi, wallet);

export default contract;
