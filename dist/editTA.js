"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTrustedAlgorithms = editTrustedAlgorithms;
const nautilus_1 = require("@deltadao/nautilus");
async function editTrustedAlgorithms(nautilus, did, trustedAlgorithms, trustedPublishers) {
    const aquariusAsset = await nautilus.getAquariusAsset(did);
    const assetBuilder = new nautilus_1.AssetBuilder(aquariusAsset);
    const serviceBuilder = new nautilus_1.ServiceBuilder({ aquariusAsset, serviceId: aquariusAsset.services[0].id });
    // Updating trusted publishers on a service
    if (trustedPublishers.length > 0) {
        for (const publisher of trustedPublishers) {
            serviceBuilder.addTrustedAlgorithmPublisher(publisher);
        }
    }
    // Updating trusted algorithms on a service
    if (trustedAlgorithms.length > 0) {
        serviceBuilder.addTrustedAlgorithms(trustedAlgorithms.map(algo => ({ did: algo })));
    }
    const service = serviceBuilder.build();
    const asset = assetBuilder.addService(service).build();
    const result = await nautilus.edit(asset);
    console.log('Edited trusted algorithms:', result);
    return result;
}
