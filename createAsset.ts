import {
    AssetBuilder,
    ConsumerParameterBuilder,
    FileTypes,
    Nautilus,
    ServiceBuilder,
    ServiceTypes,
    UrlFile
  } from '@deltadao/nautilus'
  import { NetworkConfig } from './config'
  import { Wallet } from 'ethers'



export async function publishComputeDataset(
    nautilus: Nautilus,
    networkConfig: NetworkConfig,
    pricingConfig: any,
    wallet: Wallet
  ) {
    const owner = await wallet.getAddress()
    console.log(`Your address is ${owner}`)
  
    const serviceBuilder = new ServiceBuilder({ serviceType: ServiceTypes.COMPUTE, fileType: FileTypes.URL }) // compute type dataset with URL data source
  
    const urlFile: UrlFile = {
      type: 'url',
      url: 'https://raw.githubusercontent.com/n1923730/TestData/main/db.json', // link to your file or api
      method: 'GET'
    }
  
    const service = serviceBuilder
      .setServiceEndpoint(networkConfig.providerUri)
      .setTimeout(60)
      .addFile(urlFile)
      .setPricing(pricingConfig.FREE)
      .setDatatokenNameAndSymbol('MyC2DTest', 'SYMBOL') // important for following access token transactions in the explorer
      .build()
  
    const assetBuilder = new AssetBuilder()
    const asset = assetBuilder
      .setType('dataset')
      .setName('TestPublishingAssets')
      .setDescription('Testing how to publish assets with nautilus \n\nThis asset has been published using the [nautilus-examples](https://github.com/deltaDAO/nautilus-examples) repository.')
      .setAuthor('neogramm')
      .setLicense('')
      .addService(service)
      .setOwner(owner)
      .build()
  
    const result = await nautilus.publish(asset)
    console.log(result)
  }
  