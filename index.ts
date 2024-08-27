import { Express, Request, Response } from "express";
import { Wallet, Signer, providers } from 'ethers';
import { AssetBuilder, Nautilus } from '@deltadao/nautilus';
import { editTrustedAlgorithms } from "./editTA";
import { NETWORK_CONFIGS, PRICING_CONFIGS } from "./config";
import * as f from "./helperFunctions";
//import { ComputeJob } from "@oceanprotocol/lib";    //Bei Gott nein, niemals! -> Breaking Changes!

//const ethers = require("ethers");
const ejs = require('ejs');
const express = require('express');
//const Chart = require('chart.js/auto');
var path = require('path');
//var jsdom = require('jsdom');
//var $ = require('jquery')(new jsdom.JSDOM().window);


////////////////////////////////////////////////////////////////config//////////////////////////////////////////////////////////////////////////////
const port = 8000;
const app: Express = express();
app.set('viewEngine', 'ejs');

app.use('/views', express.static(path.resolve('./views')));
app.use(express.static(path.join(__dirname, 'views')));

app.engine('html', ejs.renderFile);

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});

////////////////////////////////////////////////////////////////endpoints//////////////////////////////////////////////////////////////////////////////


//render Homepage
app.get("/", async (req: Request, res: Response) => {
    if(f.nautilus == undefined) {
        var result = f.init();
    }
    res.sendFile(path.resolve('./views/index.html'));    
});

//Homepage Button -> Alter Dataset
app.post('/publishData', async function(req, res) {
    console.log('Funktion wurde aufgerufen')
    //This can also be used to create a completly new asset
    //const assetBuilder = new AssetBuilder();
    //const networkConfig = NETWORK_CONFIGS;
    //const pricingConfig = PRICING_CONFIGS;
    //await publishComputeDataset( nautilus, networkConfig, pricingConfig, signer);

    var result = await editTrustedAlgorithms(f.nautilus, 'did:op:ea6890f851252e0646ab4887c40603182e42ab684f597f5731f02cfe9efe5be0', ['did:op:7e36f8d3c52faaa2f5aa9336b05ce9d9e499188b1408ebdeb9c0834c9b94c450'], [])
    //Todo: Show success/failure on webpage!
    res.redirect("/publishData")
});

//Homepage Button -> get Data
app.post('/showData', async function(req, res) {
    if(f.datapoints.length == 0) {
        f.getDataSet().then(async (resp) =>{
            await f.createView(resp.json());
            res.redirect("/showData");
        });  
    } else res.redirect("/showData");
});

//render Data-View with Graphic
app.get("/showData", async (req: Request, res: Response) => {
    res.render(path.resolve('./views/viewData.html'), {Labels: f.labels, Datapoints: f.datapoints, C2D: f.c2d, Avg: f.avg, Status: f.status})  
});



//show Data Button -> start C2D: starts C2D Computation
app.post('/viewData', async function(req, res) {
    console.log("StartC2D wurde aufgerufen");

    await f.startC2D();
    while(f.compute_job == undefined);

    console.log("got var compute_job");
    console.log("jobId = " + f.compute_job.jobId);
    console.log("C2D gestartet");

    res.redirect('/showData');
});


//showData Button -> get Status: retrieve Status of C2D
app.post('/getStatus', async function(req, res) {
    console.log("getStatus wurde aufgerufen");
    f.getStatus().then(() =>{
        res.redirect("showData");
    });
});

//show Data Button -> get Result of C2D Job
app.post('/getResult', async function(req, res) {
    console.log("getResult wurde aufgerufen");
    f.getResult().then(() =>{
        res.redirect("showData");
    });
});


//showData Button -> get C2D Result: reloads Page with new Information
app.get('/showC2DResult', function(req, res) {     
    res.redirect('showData');
});


//render Changed asset Page
app.get('/publishData', function(req, res) {
    res.render(path.resolve('./views/publishData.html'))
});

//Button -> Back to Homepage
app.post('/getBack', function(req, res) {
    res.redirect("/")
});
