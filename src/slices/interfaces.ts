import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { StringValueNode } from "graphql";
import { Bond, NetworkID } from "src/lib/Bond";

export interface IJsonRPCError {
  readonly message: string;
  readonly code: number;
}

export interface IBaseAsyncThunk {
  readonly networkID: NetworkID;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IGameStakeThunk extends IBaseAsyncThunk {
  readonly id: string;
  readonly amount: number;
}

export interface IGameClaimRewardsThunk extends IBaseAsyncThunk {
  readonly id: string;
}

export interface IForfeitThunk extends IBaseAsyncThunk {
  readonly address: string;
}

export interface IChangeApprovalAsyncThunk extends IBaseAsyncThunk {
  readonly token: string;
  readonly address: string;
}
export interface IMintNFTAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
  readonly index: number;
  readonly proof: Array<string>;
}

export interface ICreateListingAsyncThunk extends IBaseAsyncThunk {
  readonly amount: number;
  readonly spawnId: number;
  readonly address: string;
  readonly listPrice: string;
}

export interface ITransferNFTAsyncThunk extends IBaseAsyncThunk {
  readonly amount: number;
  readonly id: number;
  readonly address: string;
  readonly toAddress: string;
}

export interface IBuyListingAsyncThunk extends IBaseAsyncThunk {
  readonly amount: number;
  readonly offerID: number;
  readonly address: string;
}

export interface IGetMyAsyncThunk extends IBaseAsyncThunk {
  readonly admin: string;
  readonly offerID: number;
}

export interface IActionAsyncThunk extends IBaseAsyncThunk {
  readonly action: string;
  readonly address: string;
}

export interface IDeleteAsyncThunk extends IBaseAsyncThunk {
  readonly offerID: number;
}

export interface IValueAsyncThunk extends IBaseAsyncThunk {
  readonly value: string;
  readonly address: string;
}

export interface IActionValueAsyncThunk extends IValueAsyncThunk {
  readonly action: string;
}

export interface IActionValueTwoAsyncThunk extends IBaseAsyncThunk {
  readonly action: string;
  readonly address: string;
  readonly value: number;
  readonly token: string;
}

export interface IBaseAddressAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
}

// Account Slice

export interface ICalcUserBondDetailsAsyncThunk extends IBaseAddressAsyncThunk, IBaseBondAsyncThunk {}

// Bond Slice

export interface IBaseBondAsyncThunk extends IBaseAsyncThunk {
  readonly bond: Bond;
}

export interface ICalcBondDetailsAsyncThunk extends IBaseBondAsyncThunk {
  readonly value: string;
}

export interface IBondAssetAsyncThunk extends IBaseBondAsyncThunk, IValueAsyncThunk {
  readonly slippage: number;
}

export interface IRedeemBondAsyncThunk extends IBaseBondAsyncThunk {
  readonly address: string;
  readonly autostake: boolean;
}

export interface IRedeemAllBondsAsyncThunk extends IBaseAsyncThunk {
  readonly bonds: Bond[];
  readonly address: string;
  readonly autostake: boolean;
}
