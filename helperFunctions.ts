import { Express, Request, Response } from "express";
import { Wallet, Signer, providers } from 'ethers';
import { AssetBuilder, Nautilus } from '@deltadao/nautilus';


///////////////////////////////////////////////////////////////////interfaces///////////////////////////////////////////////////////////////////////////

export interface DataPoints {
    id: string;
    value: number;
}

//////////////////////////////////////////////////////////////////global variables///////////////////////////////////////////////////////////////////////

export var provider: providers.JsonRpcProvider
export var signer: Wallet
export var nautilus: Nautilus
export var compute_job: any


export var labels: string[] = [];
export var datapoints: number[] = [];

export var c2d: number = 0;
export var avg: number = 0;
export var status: string = "";

////////////////////////////////////////////////////////////////Communication with Devnet//////////////////////////////////////////////////////////////////

//initialises Config to Pontus-X Devnet Parameters
export async function init() {
    
    provider = new providers.JsonRpcProvider('https://rpc.dev.pontus-x.eu');
    signer = new Wallet('21ea41b4daed53bb966f0127d14b5e53e91014410da8fb267b351794a8bbb83c', provider);

    const customConfig = {
        chainId: 32456,
        network: 'pontusx',
        metadataCacheUri: 'https://aquarius.dev.pontus-x.eu',
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

    nautilus = await Nautilus.create(signer, customConfig);
    console.log("initialisation done");

    return ("done");
}


//consumes Dataset given it's DID
export async function getDataSet() {
    const accessUrl = await nautilus.access({ assetDid: 'did:op:0fa5657f7382ef32a82325160a5430b79be701a361dfa0f27e1c3f22a96ddaf3'});
    console.log("got URL: " + accessUrl);
    const data = await fetch(accessUrl);
    return data;
}


//accumulates the data to show in diagramm
export async function createView(datenpunkte: Promise<void>) {
    datenpunkte.then((text) => {
        while(text == undefined);        
        try {
            let dataPoints: DataPoints[] = text;
            dataPoints.forEach((pair) => {
                labels.push(pair.id);
                datapoints.push(pair.value);
            });
        } catch {
            console.log("Error occured: data format is not as specified!");
        }

        console.log("datapoints = " + datapoints);
        console.log("labels = " + labels);
    
        if(datapoints != undefined){
            console.log('now rendering the html');
        }
    });
}

//start computing C2D, given Dataset- & Algorithm-DIDs. Dataset must have Algorithm whitelisted before!
export async function startC2D() {
    if(nautilus == undefined) {
        console.log("Error: Nautilus is undefined");
        return;
    }
    compute_job = await nautilus.compute({ 
        dataset: { 
            did: 'did:op:ea6890f851252e0646ab4887c40603182e42ab684f597f5731f02cfe9efe5be0'
        }, 
        algorithm: { 
            did: 'did:op:7e36f8d3c52faaa2f5aa9336b05ce9d9e499188b1408ebdeb9c0834c9b94c450'
        } 
    })

    c2d = 1;
    return compute_job;
}

//check on Status of C2D Job
export async function getStatus(){
    if(compute_job != undefined){
        console.log("jobId = " + compute_job[0].jobId);
        status = compute_job[0].statusText;
        var result = await nautilus.getComputeStatus({ 
            jobId: compute_job[0].jobId, 
            providerUri: 'https://provider.dev.pontus-x.eu'
        }); 
        
        if(result!= undefined) {
            if(result.length > 0) {
                status = result[0].statusText;
            } else {
                status = result.statusText;
            }
            console.log("Status = " + status);
            c2d = 2;
        }
        if(status == 'Job finished') {
            c2d = 3;
        }
    }
}

//get Results of C2D Job
export async function getResult() {
    var res;
    var result = nautilus.getComputeResult({
        jobId: compute_job[0].jobId,
        providerUri: 'https://provider.dev.pontus-x.eu'
      })

    result.then(async (url) => {
        console.log("url = " + url);
        res = await fetch(url);
        if(res.body != null) {
            //for await (const chunk of res.body) {
                // Do something with each "chunk"
            //}
        }
    

    if(res == undefined) {
        console.log("res still undefined, try again in a few seconds.");
    }
})
}