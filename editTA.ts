import { Nautilus, AssetBuilder, ServiceBuilder } from '@deltadao/nautilus' 

export async function editTrustedAlgorithms(nautilus: Nautilus, did: string, trustedAlgorithms: string[], trustedPublishers: string[]){
    const aquariusAsset = await nautilus.getAquariusAsset(did)
    
    const assetBuilder = new AssetBuilder(aquariusAsset)
    const serviceBuilder = new ServiceBuilder({ aquariusAsset, serviceId: aquariusAsset.services[0].id })
    
    // Updating trusted publishers on a service
    if (trustedPublishers.length > 0) {
        for(const publisher of trustedPublishers){
            serviceBuilder.addTrustedAlgorithmPublisher(publisher)
        }
    }
    // Updating trusted algorithms on a service
    if (trustedAlgorithms.length > 0) {
        serviceBuilder.addTrustedAlgorithms(trustedAlgorithms.map(algo => ({ did: algo })))
    }
    
    const service = serviceBuilder.build()
    const asset = assetBuilder.addService(service).build()

    const result = await nautilus.edit(asset)
    console.log('Edited trusted algorithms:', result)
    return result
}