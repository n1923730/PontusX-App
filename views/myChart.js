//import {LineController, LineElement, PointElement, CategoryScale, LinearScale} from 'chart.js';

//import("chart.js");

  export function passChartData() {
  var Chart = require('chart.js/auto');
  var labels = ['a', 'b', 'c'];
  var datapoints = [1, 2, 3];

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


  var ctx = $('#viewData');

  console.log("Funktion wurde aufgerufen!");
  console.log("ctx = " + ctx.length)

  //const config = new Chart(ctx, {
  //   type: 'line',
  //  data: dataForChart,
  //});

  return dataForCharts;
  }



/*(async function() {
    const data = [
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];
  
    new Chart(
      document.getElementById('acquisitions'),
      {
        type: 'bar',
        data: {
          labels: data.map(row => row.year),
          datasets: [
            {
              label: 'Acquisitions by year',
              data: data.map(row => row.count)
            }
          ]
        }
      }
    );
  })();  */