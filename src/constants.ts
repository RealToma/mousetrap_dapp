export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph";
export const EPOCH_INTERVAL = 14400;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 2;

export const TOKEN_DECIMALS = 9;

export const POOL_GRAPH_URLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  4: {
    DAI_ADDRESS: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // duplicate
    OHM_ADDRESS: "0xC0b491daBf3709Ee5Eb79E603D73289Ca6060932",
    STAKING_ADDRESS: "0xC5d3318C0d74a72cD7C55bdf844e24516796BaB2",
    STAKING_HELPER_ADDRESS: "0xf73f23Bb0edCf4719b12ccEa8638355BF33604A1",
    OLD_STAKING_ADDRESS: "0xb640AA9082ad720c60102489b806E665d67DCE32",
    SOHM_ADDRESS: "0x1Fecda1dE7b6951B248C0B62CaeBD5BAbedc2084",
    OLD_SOHM_ADDRESS: "0x8Fc4167B0bdA22cb9890af2dB6cB1B818D6068AE",
    MIGRATE_ADDRESS: "0x3BA7C6346b93DA485e97ba55aec28E8eDd3e33E2",
    DISTRIBUTOR_ADDRESS: "0x0626D5aD2a230E05Fb94DF035Abbd97F2f839C3a",
    BONDINGCALC_ADDRESS: "0xaDBE4FA3c2fcf36412D618AfCfC519C869400CEB",
    CIRCULATING_SUPPLY_ADDRESS: "0x5b0AA7903FD2EaA16F1462879B71c3cE2cFfE868",
    TREASURY_ADDRESS: "0x0d722D813601E48b7DAcb2DF9bae282cFd98c6E7",
    REDEEM_HELPER_ADDRESS: "0xBd35d8b2FDc2b720842DB372f5E419d39B24781f",
    PT_TOKEN_ADDRESS: "0x0a2d026bacc573a8b5a2b049f956bdf8e5256cfd", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    PT_PRIZE_POOL_ADDRESS: "0xf9081132864ed5e4980CFae83bDB122d86619281", // NEW
    PT_PRIZE_STRATEGY_ADDRESS: "0x2Df17EA8D6B68Ec444c9a698315AfB36425dac8b", // NEW
  },
  1: {
    DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
    OHM_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
    STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2",
    SOHM_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
    OLD_SOHM_ADDRESS: "0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe",
    PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
    AOHM_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
    MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
    DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
    BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
    CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
    TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
    CRUCIBLE_OHM_LUSD: "0x2230ad29920D61A535759678191094b74271f373",
    LQTY: "0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d",
    MIST: "0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab",
    REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
    FUSE_6_SOHM: "0x59bd6774c22486d9f4fab2d448dce4f892a9ae25", // Tetranode's Locker
    FUSE_18_SOHM: "0x6eDa4b59BaC787933A4A21b65672539ceF6ec97b", // Olympus Pool Party
    PT_TOKEN_ADDRESS: "0x0E930b8610229D74Da0A174626138Deb732cE6e9", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    PT_PRIZE_POOL_ADDRESS: "0xEaB695A8F5a44f583003A8bC97d677880D528248", // NEW
    PT_PRIZE_STRATEGY_ADDRESS: "0xf3d253257167c935f8C62A02AEaeBB24c9c5012a", 
  },
  1666600000: {
    OHM_ADDRESS: "0xBbD83eF0c9D347C85e60F1b5D2c58796dBE1bA0d",
    DAI_ADDRESS: "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
    FRAX_ADDRESS: "0xeb6c08ccb4421b6088e581ce04fcfbed15893ac3",
    TREASURY_ADDRESS: "0xf8c08c5aD8270424Ad914d379e85aC03a44fF996",
    BONDINGCALC_ADDRESS: "0xA5eC40A632df14b9810e98583bCEc137A69a3699",
    STAKING_ADDRESS: "0x72Be77E232Dd13E6aE06088696B83256892c2933",
    SOHM_ADDRESS: "0x6C68A2dfEc9fA85Deb2c6e40c73c6760504dbcEC",
    DISTRIBUTOR_ADDRESS: "0x6c77C235559c87b1B309eD98D80c0c1025114590",
    STAKING_HELPER_ADDRESS: "0xfB7c6c0Ec7e02731f3E17528afE0f493325A8565",
    REDEEM_HELPER_ADDRESS: "0x7E624D2627cE949A41dBf0946145F8281743277b",
    CIRC_SUPPLY_ADDRESS: "0x4c5fADE474AE045acBD141ed42B92378766De8d5",
    NFT_CONTRACT_ADDRESS: "0x4e9c30CbD786549878049f808fb359741BF721ea",
    MARKETPLACE_ADDRESS: "0x5d28FC5BC1065DA8dEC396D0c5D20c524CA83278",
    MICE_STAKING_CONTRACT: "0x2a706BE4538C08b029a96AD326F2502685fD4169",
    CAT_STAKING_CONTRACT: "0xeDbdbF246AE1FAeB54b1E7Bf320c1150C08d3272",
    TRAP_STAKING_CONTRACT: "0x759f642d7A863Fa012F2Ea64f8E8cdcB53F3296B",
    GAME_CONTRACT_ADDRESS: "0xB4cf2F19bBD2a4b7bC059fa1f9625EAbB3833ee3",
    MICE_REBASE_ADDRESS: "0x61bE40BA3CF2485872DD20e838AD58759A86Bac0",
    CHEEZPASS_CONTRACT_ADDRESS: "0x4175c4A80c13604D93b6BAfE90aBfc80ca37F718"
  },
};
