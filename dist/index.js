"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datapoints = exports.labels = void 0;
const ethers_1 = require("ethers");
const nautilus_1 = require("@deltadao/nautilus");
const editTA_1 = require("./editTA");
const config_1 = require("./config");
//import { ComputeJob } from "@oceanprotocol/lib";
const ethers = require("ethers");
const ejs = require('ejs');
const express = require('express');
const Chart = require('chart.js/auto');
var path = require('path');
var jsdom = require('jsdom');
var $ = require('jquery')(new jsdom.JSDOM().window);
const port = 8000;
const app = express();
app.set('viewEngine', 'ejs');
app.use('/views', express.static(path.resolve('./views')));
app.use(express.static(path.join(__dirname, 'views')));
app.engine('html', ejs.renderFile);
exports.labels = [];
exports.datapoints = [];
var provider;
var signer;
var nautilus;
var compute_job;
async function init() {
    provider = new ethers_1.providers.JsonRpcProvider('https://rpc.dev.pontus-x.eu');
    signer = new ethers_1.Wallet('21ea41b4daed53bb966f0127d14b5e53e91014410da8fb267b351794a8bbb83c', provider);
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
    nautilus = await nautilus_1.Nautilus.create(signer, customConfig);
    console.log("initialisation done");
    return ("done");
}
async function getDataSet() {
    const accessUrl = await nautilus.access({ assetDid: 'did:op:0fa5657f7382ef32a82325160a5430b79be701a361dfa0f27e1c3f22a96ddaf3' });
    console.log("got URL: " + accessUrl);
    const data = await fetch(accessUrl);
    return data;
}
async function createView(datenpunkte, res) {
    datenpunkte.then((text) => {
        if (text == undefined || text == null) {
            createView(datenpunkte, res);
        }
        else {
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
                res.render(path.resolve('./views/viewData.html'), { Labels: exports.labels, Datapoints: exports.datapoints, C2D: 0 });
            }
        }
    });
}
async function startC2D() {
    if (nautilus == undefined) {
        console.log("Error: Nautilus is undefined");
        return;
    }
    return await nautilus.compute({
        dataset: {
            did: 'did:op:ea6890f851252e0646ab4887c40603182e42ab684f597f5731f02cfe9efe5be0'
        },
        algorithm: {
            did: 'did:op:7e36f8d3c52faaa2f5aa9336b05ce9d9e499188b1408ebdeb9c0834c9b94c450'
        }
    });
}
app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});
app.post('/', function (req, res) {
    console.log("post funktion wurde aufgerufen");
    res.redirect("/showData");
    //res.sendFile(path.resolve('./views/viewData.html'));
});
app.get("/", async (req, res) => {
    var result = init();
    res.sendFile(path.resolve('./views/index.html'));
});
app.get("/showData", async (req, res) => {
    getDataSet().then((resp) => {
        createView(resp.json(), res);
    });
});
app.post('/viewData', async function (req, res) {
    console.log("StartC2D wurde aufgerufen");
    compute_job = await startC2D();
    while (compute_job == undefined)
        ;
    console.log("got var compute_job");
    console.log("jobId = " + compute_job.jobId);
    console.log("C2D gestartet");
    res.redirect('/viewData');
    /*compute_job.then(async (c_job) =>{
        if(c_job == undefined) return;
        compute_job = await nautilus.getComputeStatus({
            jobId: c_job.jobId,
            providerUri: 'https://provider.dev.pontus-x.eu'
        })
        compute_job.then((c_job) => {
            console.log(c_job.statusText)
        })
    })*/
    //res.redirect("/showC2DResult")
});
app.post('/getStatus', async function (req, res) {
    var status = await nautilus.getComputeStatus({
        jobId: compute_job.jobId,
        providerUri: 'https://provider.dev.pontus-x.eu'
    });
    console.log("Status = " + status);
    res.render(path.resolve('./views/viewData.html'), { Labels: exports.labels, Datapoints: exports.datapoints, C2D: 2, Status: status });
});
app.get('/showC2DResult', function (req, res) {
    res.render(path.resolve('./views/viewData.html'), { Labels: exports.labels, Datapoints: exports.datapoints, C2D: 0 });
});
app.post('/publishData', async function (req, res) {
    console.log('Funktion wurde aufgerufen');
    const assetBuilder = new nautilus_1.AssetBuilder();
    const networkConfig = config_1.NETWORK_CONFIGS;
    const pricingConfig = config_1.PRICING_CONFIGS;
    //await publishComputeDataset( nautilus, networkConfig, pricingConfig, signer);
    var result = await (0, editTA_1.editTrustedAlgorithms)(nautilus, 'did:op:ea6890f851252e0646ab4887c40603182e42ab684f597f5731f02cfe9efe5be0', ['did:op:7e36f8d3c52faaa2f5aa9336b05ce9d9e499188b1408ebdeb9c0834c9b94c450'], []);
    //Todo: Show success/failure on webpage!
    res.redirect("/publishData");
});
app.get('/publishData', function (req, res) {
    res.render(path.resolve('./views/publishData.html'));
});
app.post('/getBack', function (req, res) {
    res.redirect("/");
});
