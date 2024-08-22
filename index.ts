import { Express, Request, Response } from "express";
import { Wallet, Signer, providers } from 'ethers';
import { Nautilus } from '@deltadao/nautilus';
import { Certificate } from "crypto";
//import { Chart } from 'chart.js';

//import { ChartItem } from 'chart.js/auto';
//import 'jquery'

const ethers = require("ethers");
const ejs = require('ejs');
const express = require('express');
const Chart = require('chart.js/auto');
var path = require('path');
//var $ = require("jquery");

var jsdom = require('jsdom');

var $ = require('jquery')(new jsdom.JSDOM().window);

//const ChartItem = require('chart.js/auto')

const port = 8000;
const app: Express = express();
app.set('viewEngine', 'ejs');
app.use('/views', express.static(path.resolve('./views')));
console.log("path.resolve(views= " + path.resolve('./views'));
app.use(express.static(path.join(__dirname, 'views')));

app.engine('html', ejs.renderFile);

//ChartItem: (await import('chart.js')). defaults;   //oder Modul spezifizieren statt defaults


interface DataPoints {
    id: string;
    value: number;
}

export var labels: string[] = ['a', 'b', 'c'];
export var datapoints: number[] = [1, 2, 3];


async function getDataSet() {
 
    //const provider = new ethers.JsonRpcProvider('https://rpc.dev.pontus-x.eu');
    const provider = new providers.JsonRpcProvider('https://rpc.dev.pontus-x.eu');
    const signer = new Wallet('21ea41b4daed53bb966f0127d14b5e53e91014410da8fb267b351794a8bbb83c', provider);
    console.log("created wallet");
    console.log("created provider: "+ (await provider.detectNetwork()).chainId);
    
    var datenpunkte = "";

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


    const nautilus = await Nautilus.create(signer, customConfig);
    console.log("created Nautilus");

    const accessUrl = await nautilus.access({ assetDid: 'did:op:0fa5657f7382ef32a82325160a5430b79be701a361dfa0f27e1c3f22a96ddaf3'});
    console.log("got URL: " + accessUrl);
    const data = await fetch(accessUrl);
    
    console.log("hier.");

    data.text().then((text) => {
        datenpunkte = text;
        console.log("Empfangene Daten: " + datenpunkte);
        return datenpunkte;
      });
    
}

function createView(datenpunkte: Promise<void>) {
    //var datenpunkte = getDataSet();
    datenpunkte.then((text) => {
        if (text == undefined || text == null) {
            createView(datenpunkte);
        } else {
        console.log("This is going to the frontend: ");
        console.log(text);
        return text;
        }
    });
}

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});


app.post('/', function(req, res) {
    console.log("post funktion wurde aufgerufen");    
    res.redirect("/showData")
    //res.sendFile(path.resolve('./views/viewData.html'));
});


app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.resolve('./views/index.html'));
});

app.get("/showData", (req: Request, res: Response) => {
    var datenpunkte = getDataSet();
    const text = createView(datenpunkte);
    console.log('now rendering html');

    let dataPoints: DataPoints[] = [];
    if(text != undefined) {
        datapoints = JSON.parse(text); 
    }          

    dataPoints.forEach((pair) => {
        labels.push(pair.id);
        datapoints.push(pair.value);
    });

        /*
    const dataForChart = {
    labels: labels,
    datasets: [{
        label: 'Fuellstand',
        data: datapoints,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
    };

    $( document ).ready(function() {
        console.log( "ready!" );
    })

    var ctx = $('.canvas');
    console.log("found Element: " + ctx.length);
    console.log("current jquery object: " + $);
    //var ctx = document.getElementById('line-chart');
    const config = new Chart(ctx, {
        type: 'line',
        data: dataForChart,
    }); */

    res.render(path.resolve('./views/viewData.html'), {Labels: labels, Datapoints: datapoints});   //ersetze aabbcc mit text, das kann jedoch nicht gerendert werden.
        
});


