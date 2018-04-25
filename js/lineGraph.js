// class for line chart, describing how the chart is set up

// global variable for chart
var chart;

function plot(point, chartno) {
  console.log(point);

  var series = mqttConn.chart.series[0],
  // graph starts shifting to the left when it plots 100 points so it will not
  // become too narrow between points
  shift = mqttConn.series.data.length > 100;

  chart.series[chartno].addPoint(point, true, shift); // add the point
}

var graphOptions = {

  responsive: true,
  title: {
    display: true,
    position: "top",
    text: "Sensor",
    fontColor: "#111",
    fontSize: 18
  },
  legend: {
    display: true,
    position: "bottom",
    labels: {
      fontColor: "#333",
      fontSize: 16
    }
  },
  scales: {
    xAxis: [{
      type: 'realtime', // x axis will scroll from right to left
      text: 'Time',
      margin: 30
    }],
    yAxis: [{
      minPadding: 0.2,
      maxPadding: 0.2,
      title: {
        text: 'Temp °C / Humidity %',
	      margin: 80
      }
    }]
  },
  plugins: {
    streaming: {
      onRefresh: function(chart) {
        chart.data.datasets.forEach(function(dataset) {
          dataset.data.push({
            x: Date.now(),
            y: Math.random()
          });
        });
      }
    }
  }
};

$(document).ready(function(){

  // get the line chart canvas
  var ctx = $("#line-chartcanvas");

  var chartData = {
    labels: [mqttConn.timeEpoch],
    datasets: [{
      data: [mqttConn.plotMqtt],
      borderColor: "lightgreen",    // color of the line
      fill: false,                  // do not fill the line from x-axis to point
      lineTension: 0,               // line tension
      radius: 2                     // radius of plotted points
    }]
  }


  var chart = new Chart (ctx, { ctx,
      type: 'line',
      data: chartData,
      options: graphOptions
  });

  function setData(chartData) {
    data.push(mqttConn.addData);
    data.shift();
  }
});
