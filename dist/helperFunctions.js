"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = exports.average = exports.c2d = exports.datapoints = exports.labels = exports.compute_job = exports.nautilus = exports.signer = exports.provider = void 0;
exports.init = init;
exports.getDataSet = getDataSet;
exports.createView = createView;
exports.startC2D = startC2D;
exports.getStatus = getStatus;
exports.getResult = getResult;
const ethers_1 = require("ethers");
const nautilus_1 = require("@deltadao/nautilus");
exports.labels = [];
exports.datapoints = [];
exports.c2d = 0;
exports.average = 0;
exports.status = "";
////////////////////////////////////////////////////////////////Communication with Devnet//////////////////////////////////////////////////////////////////
//initialises Config to Pontus-X Devnet Parameters
async function init() {
    exports.provider = new ethers_1.providers.JsonRpcProvider('https://rpc.dev.pontus-x.eu');
    exports.signer = new ethers_1.Wallet('21ea41b4daed53bb966f0127d14b5e53e91014410da8fb267b351794a8bbb83c', exports.provider);
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
    exports.nautilus = await nautilus_1.Nautilus.create(exports.signer, customConfig);
    console.log("initialisation done");
    return ("done");
}
//consumes Dataset given it's DID
async function getDataSet(showDid) {
    try {
        const accessUrl = await exports.nautilus.access({ assetDid: showDid }); //'did:op:0fa5657f7382ef32a82325160a5430b79be701a361dfa0f27e1c3f22a96ddaf3'});
        console.log("got URL: " + accessUrl);
        const data = await fetch(accessUrl);
        return data;
    }
    catch (err) {
        console.log("Error occured. Its probably due to an invalid DID, or because the Dataset was only to be used for C2D");
        console.log(err);
    }
}
//accumulates the data to show in diagramm
async function createView(datenpunkte) {
    datenpunkte.then((text) => {
        while (text == undefined)
            ;
        try {
            let dataPoints = text;
            dataPoints.forEach((pair) => {
                exports.labels.push(pair.id);
                exports.datapoints.push(pair.value);
            });
        }
        catch (_a) {
            console.log("Error occured: data format is not as specified!");
        }
        console.log("datapoints = " + exports.datapoints);
        console.log("labels = " + exports.labels);
        if (exports.datapoints != undefined) {
            console.log('now rendering the html');
        }
    });
}
//start computing C2D, given Dataset- & Algorithm-DIDs. Dataset must have Algorithm whitelisted before!
async function startC2D() {
    if (exports.nautilus == undefined) {
        console.log("Error: Nautilus is undefined");
        return;
    }
    exports.compute_job = await exports.nautilus.compute({
        dataset: {
            did: 'did:op:ea6890f851252e0646ab4887c40603182e42ab684f597f5731f02cfe9efe5be0'
        },
        algorithm: {
            did: 'did:op:7e36f8d3c52faaa2f5aa9336b05ce9d9e499188b1408ebdeb9c0834c9b94c450'
        }
    });
    exports.c2d = 1;
    return exports.compute_job;
}
//check on Status of C2D Job
async function getStatus() {
    if (exports.compute_job != undefined) {
        exports.status = exports.compute_job[0].statusText;
        var result = await exports.nautilus.getComputeStatus({
            jobId: exports.compute_job[0].jobId,
            providerUri: 'https://provider.dev.pontus-x.eu'
        });
        if (result != undefined) {
            if (result.length > 0) {
                exports.status = result[0].statusText;
            }
            else {
                exports.status = result.statusText;
            }
            console.log("Status = " + exports.status);
            exports.c2d = 2;
        }
        if (exports.status == 'Job finished') {
            exports.c2d = 3;
        }
    }
}
//get Results of C2D Job
async function getResult() {
    var _a;
    var res;
    var url = await exports.nautilus.getComputeResult({
        jobId: exports.compute_job[0].jobId,
        providerUri: 'https://provider.dev.pontus-x.eu'
    });
    console.log("got result data url = " + url);
    res = await fetch(url);
    if (res.headers.get('content-type') == 'application/octet-stream') {
        const reader = (_a = res.body) === null || _a === void 0 ? void 0 : _a.getReader();
        var text = "";
        while (true) {
            const { value, done } = await reader.read();
            console.log(value);
            if (done)
                break;
            text += await (new TextDecoder().decode(value));
        }
        console.log('received the following text = ' + text);
        let start = text.indexOf(':') + 2;
        let end = text.length - 1;
        exports.average = text.substring(start, end);
        exports.c2d = 4;
        if (res == undefined) {
            console.log("res still undefined, try again in a few seconds.");
        }
    }
}
