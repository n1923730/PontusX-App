import { Express, Request, Response } from "express";
import { editTrustedAlgorithms } from "./editTA";
import * as f from "./helperFunctions";

const ejs = require('ejs');
const express = require('express');
var path = require('path');
const bodyParser = require('body-parser');


////////////////////////////////////////////////////////////////config//////////////////////////////////////////////////////////////////////////////
const port = 8000;
const app: Express = express();
app.set('viewEngine', 'ejs');

app.use('/views', express.static(path.resolve('./views')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({extended: false}));

app.engine('html', ejs.renderFile);

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});

var result = "failed";

////////////////////////////////////////////////////////////////endpoints//////////////////////////////////////////////////////////////////////////////


//render Homepage
app.get("/", async (req: Request, res: Response) => {
    if(f.nautilus == undefined) {
        await f.init();
        res.sendFile(path.resolve('./views/index.html'));   
    }
    res.sendFile(path.resolve('./views/index.html'));    
});

//Homepage Button -> Alter Dataset
app.post('/publishData', async function(req, res) {
  
    console.log("DID of the dataset: " + req.body.dataDid);
    console.log("DID of the algorithm: " + req.body.algoDid);

    var dataDid = req.body.dataDid? req.body.dataDid : 'did:op:ea6890f851252e0646ab4887c40603182e42ab684f597f5731f02cfe9efe5be0';
    var algoDid = req.body.algoDid? req.body.algoDid : 'did:op:7e36f8d3c52faaa2f5aa9336b05ce9d9e499188b1408ebdeb9c0834c9b94c450';

    if(dataDid.length != ('did:op:ea6890f851252e0646ab4887c40603182e42ab684f597f5731f02cfe9efe5be0').length || algoDid.length != ('did:op:ea6890f851252e0646ab4887c40603182e42ab684f597f5731f02cfe9efe5be0').length) {
        console.log("Error: this is not a valid did!");
        result = "Bitte geben Sie eine valide DID ein!";
        res.redirect("/publishData")
        return;
    }

    var response = await editTrustedAlgorithms(f.nautilus, dataDid, [algoDid], []);
    if(response != undefined && response.ddo != undefined) {
        result = "Das hat funktioniert. Der Algortihmus ist jetzt auf der Whitelist, und ein C2D-Prozess kann gestartet werden.";
    } 
    res.redirect("/publishData")
   
    //This can also be used to create a completly new asset
    //const assetBuilder = new AssetBuilder();
    //const networkConfig = NETWORK_CONFIGS;
    //const pricingConfig = PRICING_CONFIGS;
    //await publishComputeDataset( nautilus, networkConfig, pricingConfig, signer);

    
});

//Homepage Button -> get Data
app.post('/showData', async function(req, res) {
    if(req.body != undefined) {
        var showDid = req.body.showDid;
        console.log("DID of the dataset to be displayed: " + showDid);

        if(f.datapoints.length == 0) {
            f.getDataSet(showDid).then(async (resp) =>{
                if(resp == undefined) {
                    return;
                }
                await f.createView(resp.json());
                res.redirect("/showData");
            });  
        } else res.redirect("/showData");
    } else console.log("Error: missing input data");
    
});

//render Data-View with Graphic
app.get("/showData", async (req: Request, res: Response) => {
    res.render(path.resolve('./views/viewData.html'), {Labels: f.labels, Datapoints: f.datapoints, C2D: f.c2d, Avg: f.average, Status: f.status})  
});



//show Data Button -> start C2D: starts C2D Computation
app.post('/viewData', async function(req, res) {
    console.log("StartC2D was called. This may take a while.");
    if(f.compute_job == undefined) {
        await f.startC2D();
        while(f.compute_job == undefined);
        console.log("jobId = " + f.compute_job.jobId);
        console.log("C2D started");
    } else console.log("C2D already started, not doing this again!");
    res.redirect('/showData');
});


//showData Button -> get Status: retrieve Status of C2D
app.post('/getStatus', async function(req, res) {
    f.getStatus().then(() =>{
        res.redirect("showData");
    });
});

//show Data Button -> get Result of C2D Job
app.post('/getResult', async function(req, res) {
    f.getResult().then(() =>{
        res.redirect("showData");
    });
});


//render Changed asset Page
app.get('/publishData', function(req, res) {
    res.render(path.resolve('./views/publishData.html'), {Result: result})
});

//Button -> Back to Homepage
app.post('/getBack', function(req, res) {
    res.redirect("/")
});
