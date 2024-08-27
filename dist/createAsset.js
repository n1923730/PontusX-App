"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishComputeDataset = publishComputeDataset;
const nautilus_1 = require("@deltadao/nautilus");
async function publishComputeDataset(nautilus, networkConfig, pricingConfig, wallet) {
    const owner = await wallet.getAddress();
    console.log(`Your address is ${owner}`);
    const serviceBuilder = new nautilus_1.ServiceBuilder({ serviceType: nautilus_1.ServiceTypes.COMPUTE, fileType: nautilus_1.FileTypes.URL }); // compute type dataset with URL data source
    const urlFile = {
        type: 'url',
        url: 'https://raw.githubusercontent.com/n1923730/TestData/main/db.json', // link to your file or api
        method: 'GET'
    };
    const service = serviceBuilder
        .setServiceEndpoint(networkConfig.providerUri)
        .setTimeout(60)
        .addFile(urlFile)
        .setPricing(pricingConfig.FREE)
        .setDatatokenNameAndSymbol('MyC2DTest', 'SYMBOL') // important for following access token transactions in the explorer
        .build();
    const assetBuilder = new nautilus_1.AssetBuilder();
    const asset = assetBuilder
        .setType('dataset')
        .setName('TestPublishingAssets')
        .setDescription('Testing how to publish assets with nautilus \n\nThis asset has been published using the [nautilus-examples](https://github.com/deltaDAO/nautilus-examples) repository.')
        .setAuthor('neogramm')
        .setLicense('')
        .addService(service)
        .setOwner(owner)
        .build();
    const result = await nautilus.publish(asset);
    console.log(result);
}
