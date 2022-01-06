import { StableBond, LPBond, NetworkID, CustomBond } from "src/lib/Bond";
import { addresses } from "src/constants";
import { BigNumberish } from "ethers";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";

import Jewel from "src/assets/tokens/jewel_bond.png";
import Dai from "src/assets/tokens/DAI1.png";
import Usdc from "src/assets/tokens/USDC1.png";
import CheezDaiLP from "src/assets/tokens/CHEEZ-DAI2.png";
import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";

export const jewel = new CustomBond({
  name: "jewel",
  displayName: "JEWEL",
  bondToken: "JEWEL",
  bondIconSvg: Jewel,
  bondContractABI: DaiBondContract,
  isAvailable: {[NetworkID.Mainnet]: true, [NetworkID.Testnet]: false},
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xE27DbeC37666353Ac26Ab8c2D50b2AAc9ea2CAf8",
      reserveAddress: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x372e60D4760e998D2A1f419711EE9FC6D0A9AA9C",
      reserveAddress: "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, NetworkId, provider) {
    let ethPrice = await getTokenPrice("defi-kingdoms")
    const token = this.getContractForReserve(NetworkId, provider);
    let ethAmount: BigNumberish = await token.balanceOf(addresses[NetworkId].TREASURY_ADDRESS);
    ethAmount = Number(ethAmount.toString()) / Math.pow(10, 18);
    console.log(ethAmount, ethPrice, "jewel")
    return ethAmount * ethPrice;
  },
});


export const dai = new StableBond({
  name: "dai",
  displayName: "1DAI",
  bondToken: "DAI",
  bondIconSvg: Dai,
  bondContractABI: DaiBondContract,
  isAvailable: {[NetworkID.Mainnet]: false, [NetworkID.Testnet]: false},
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x67D82c7070c4EB14E149C30467f96B686F055Aa8",
      reserveAddress: "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x67D82c7070c4EB14E149C30467f96B686F055Aa8",
      reserveAddress: "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
    },
  },
});


export const frax = new StableBond({
  name: "frax",
  displayName: "1FRAX",
  bondToken: "FRAX",
  bondIconSvg: Usdc,
  bondContractABI: DaiBondContract,
  isAvailable: {[NetworkID.Mainnet]: false, [NetworkID.Testnet]: false},
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xf7fC4a9f9FF40254E4E6629571C41916DFe4396B",
      reserveAddress: "0xeb6c08ccb4421b6088e581ce04fcfbed15893ac3",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xf7fC4a9f9FF40254E4E6629571C41916DFe4396B",
      reserveAddress: "0xeb6c08ccb4421b6088e581ce04fcfbed15893ac3",
    },
  },
});

export const ohm_dai = new LPBond({
  name: "ohm_dai_lp",
  displayName: "CHEEZ-DAI LP",
  bondToken: "DAI",
  bondIconSvg: CheezDaiLP,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  isAvailable: {[NetworkID.Mainnet]: false, [NetworkID.Testnet]: false},
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x7b8EC969c8AA8D61bF4AE4eB7bd5cca4a704dB27",
      reserveAddress: "0x82723f6c0b32F28ddc2006b9cdBCa6cEE0ad957a",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x7b8EC969c8AA8D61bF4AE4eB7bd5cca4a704dB27",
      reserveAddress: "0x82723f6c0b32F28ddc2006b9cdBCa6cEE0ad957a",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0xBbD83eF0c9D347C85e60F1b5D2c58796dBE1bA0d/0xef977d2f931c1978db5f6747666fa1eacb0d0339",
});

export const cheez_dai = new LPBond({
  name: "cheez_dai_lp",
  displayName: "CHEEZ-DAI LP",
  bondToken: "DAI",
  bondIconSvg: CheezDaiLP,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  isAvailable: {[NetworkID.Mainnet]: false, [NetworkID.Testnet]: false},
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x579c91C6FBf8f674a1A9b5fAaD8F130e2F051869",
      reserveAddress: "0x82723f6c0b32F28ddc2006b9cdBCa6cEE0ad957a",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x7b8EC969c8AA8D61bF4AE4eB7bd5cca4a704dB27",
      reserveAddress: "0x82723f6c0b32F28ddc2006b9cdBCa6cEE0ad957a",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0xBbD83eF0c9D347C85e60F1b5D2c58796dBE1bA0d/0xef977d2f931c1978db5f6747666fa1eacb0d0339",
});

export const cheez_dai_2 = new LPBond({
  name: "cheez_dai_lp_2",
  displayName: "CHEEZ-DAI LP",
  bondToken: "DAI",
  bondIconSvg: CheezDaiLP,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  isAvailable: {[NetworkID.Mainnet]: true, [NetworkID.Testnet]: false},
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xCa2D53268979Ce721D4Ab08cba826842e201d61C",
      reserveAddress: "0x82723f6c0b32F28ddc2006b9cdBCa6cEE0ad957a",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x7b8EC969c8AA8D61bF4AE4eB7bd5cca4a704dB27",
      reserveAddress: "0x82723f6c0b32F28ddc2006b9cdBCa6cEE0ad957a",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0xBbD83eF0c9D347C85e60F1b5D2c58796dBE1bA0d/0xef977d2f931c1978db5f6747666fa1eacb0d0339",
});



export const allBonds = [jewel, cheez_dai_2, cheez_dai, dai, frax, ohm_dai];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

export default allBonds;
