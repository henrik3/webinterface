// This class should connect to mqtt broker, subscribe to topic and plot data to graph

var broker = 'm23.cloudmqtt.com';
var port = 35779;
var topic = 'lubcos/#'; //works with wildcard # and + topics dynamically now

var chart;
var mqttTopics = new Array();
var timeEpoch = new Date().getTime();

var client = new Paho.MQTT.Client(broker, port, "client_ID");

client.onMessageArrived = onMessageArrived;
client.onConnectionLost = onConnectionLost;

var options = {
  timeout: 3,
  useSSL: true,
  userName: "fmkleldp",
  password: "xElaY3QWFwBy",
  onSuccess: onConnect,
  onFailure: doFail
};

function onConnect() {
  console.log("Successfully connected to: " + broker);
  client.subscribe(topic, {qos: 0});
  console.log("Subscribed to: " + topic);
}

function doFail(message) {
  console.log("Connection failed: " + message.errorMessage);
}

function onConnectionLost(responseObject) {
  console.log("connection lost: " + responseObject.errorMessage);
};

function onMessageArrived(message) {
  console.log(message.destinationName, '',message.payloadString);


  if (mqttTopics.indexOf(message.destinationName) < 0){

      mqttTopics.push(message.destinationName);
      var y = mqttTopics.indexOf(message.destinationName);

      //create new data series for the chart
    var newseries = {
              id: y,
              name: message.destinationName,
              data: []
              };

    chart.addSeries(newseries);

      };

  var y = mqttTopics.indexOf(message.destinationName);

  var thenum = message.payloadString.replace( /^\D+/g, '');
  var plotMqtt = [timeEpoch, Number(thenum)];
  if (isNumber(thenum)) {
    console.log('is a proper number, will send to chart.')
    plot(plotMqtt, y);
  };
};

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

function init() {
  client.connect(options);
};

function plot(point, chartno) {
  console.log(point);

      var series = chart.series[0],

          shift = series.data.length > 200;

      chart.series[chartno].addPoint(point, true, shift);

};

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

 $(document).ready(function() {
   var ctx = $("#line-chartcanvas");

    var chartData = {
      labels: [timeEpoch],

    }


 });
