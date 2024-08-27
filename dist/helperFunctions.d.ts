import { Wallet, providers } from 'ethers';
import { Nautilus } from '@deltadao/nautilus';
export interface DataPoints {
    id: string;
    value: number;
}
export declare var provider: providers.JsonRpcProvider;
export declare var signer: Wallet;
export declare var nautilus: Nautilus;
export declare var compute_job: any;
export declare var labels: string[];
export declare var datapoints: number[];
export declare var c2d: number;
export declare var avg: number;
export declare var status: string;
export declare function init(): Promise<string>;
export declare function getDataSet(): Promise<globalThis.Response>;
export declare function createView(datenpunkte: Promise<void>): Promise<void>;
export declare function startC2D(): Promise<any>;
export declare function getStatus(): Promise<void>;
export declare function getResult(): Promise<void>;
