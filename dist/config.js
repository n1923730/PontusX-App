"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICING_CONFIGS = exports.NETWORK_CONFIGS = void 0;
exports.NETWORK_CONFIGS = {
    chainId: 32456,
    network: 'pontusxdev',
    metadataCacheUri: 'https://aquarius.pontus-x.eu',
    nodeUri: 'https://rpc.dev.pontus-x.eu',
    providerUri: 'https://provider.dev.pontus-x.eu',
    subgraphUri: 'https://subgraph.dev.pontus-x.eu',
    oceanTokenAddress: '0xdF171F74a8d3f4e2A789A566Dce9Fa4945196112',
    oceanTokenSymbol: 'OCEAN',
    fixedRateExchangeAddress: '0x8372715D834d286c9aECE1AcD51Da5755B32D505',
    dispenserAddress: '0x5461b629E01f72E0A468931A36e039Eea394f9eA',
    nftFactoryAddress: '0xFdC4a5DEaCDfc6D82F66e894539461a269900E13',
    providerAddress: '0x68C24FA5b2319C81b34f248d1f928601D2E5246B'
};
exports.PRICING_CONFIGS = {
    FREE: {
        type: 'free'
    },
    FIXED_OCEAN: {
        type: 'fixed',
        freCreationParams: {
            fixedRateAddress: '0x8372715D834d286c9aECE1AcD51Da5755B32D505',
            baseTokenAddress: '0xdF171F74a8d3f4e2A789A566Dce9Fa4945196112',
            baseTokenDecimals: 18,
            datatokenDecimals: 18,
            fixedRate: '1', // this is the price
            marketFee: '0',
            marketFeeCollector: '0x0000000000000000000000000000000000000000'
        }
    },
    FIXED_EUROE: {
        type: 'fixed',
        freCreationParams: {
            fixedRateAddress: '0x8372715D834d286c9aECE1AcD51Da5755B32D505',
            baseTokenAddress: '0x8A4826071983655805bF4f29828577Cd6b1aC0cB',
            baseTokenDecimals: 18, // adapted for EUROe decimals
            datatokenDecimals: 18,
            fixedRate: '1', // this is the price
            marketFee: '0',
            marketFeeCollector: '0x0000000000000000000000000000000000000000'
        }
    }
};
