// This class should connect to mqtt broker, subscribe to topic and plot data to graph

// broker/host to connect to
var broker = 'm23.cloudmqtt.com';
// websocket port
var port = 35779;
// topic to subscribe to, # for wildcard.
var topic = 'lubcos/#';

var myChart;
var time = moment();
var mqttTopics = new Array();
//var timeEpoch = new Date().getTime();

// create new Paho MQTT client, connect with broker, port and client id
var client = new Paho.MQTT.Client(broker, port, "client_ID");

client.onMessageArrived = onMessageArrived;
client.onConnectionLost = onConnectionLost;

// ************************************************************************ //

// options for connecting to broker
var options = {
  timeout: 3,
  useSSL: true,
  userName: "fmkleldp",
  password: "8ppdzb_1bFSG",
  onSuccess: onConnect,
  onFailure: doFail
};

// ************************************************************************ //

// on connection, print which broker it connectede to and which topic it is subscribing to
function onConnect() {
  console.log("Successfully connected to: " + broker);
  client.subscribe(topic, {qos: 0});
  console.log("Subscribed to: " + topic);
}

// ************************************************************************ //

// if connection failes, print error message
function doFail(message) {
  console.log("Connection failed: " + message.errorMessage);
}

// ************************************************************************ //

// when connection to the broker is lost print error message
// if connection is lost, try to reconnect
function onConnectionLost(responseObject) {
  console.log("connection lost: " + responseObject.errorMessage);
  //window.setTimeout(location.reload(),5000);
};

// ************************************************************************ //

function onMessageArrived(message) {
  console.log(message.destinationName, '',message.payloadString);


  if (mqttTopics.indexOf(message.destinationName) < 0){
      // push incoming topics to mqttTopics array
      mqttTopics.push(message.destinationName);
      var y = mqttTopics.indexOf(message.destinationName);

      //create new data series for the chart
    var newseries = {
              id: y,
              name: message.destinationName,
              data: []
              };

    myChart.addSeries(newseries);

      };

  var y = mqttTopics.indexOf(message.destinationName);

  var thenum = message.payloadString.replace( /^\D+/g, '');
  var plotMqtt = [time, Number(thenum)];
  if (isNumber(thenum)) {
    console.log('is a proper number, will send to chart.')
    plot(plotMqtt, y);
  };
};

// ************************************************************************ //

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

// ************************************************************************ //

// connect to client by using the information from the option variable
function init() {
  client.connect(options);
};

// ************************************************************************ //

function plot(point, chartno) {
  console.log(point);

      var series = myChart.series[0],

          shift = series.data.length > 200;

      myChart.series[chartno].addPoint(point, true, shift);

};

// ************************************************************************ //

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
      onRefresh: function(myChart) {
        myChart.data.datasets.forEach(function(dataset) {
          dataset.data.push({
            x: Date.now(),
            y: Math.random()
          });
        });
      }
    }
  }
};

// ************************************************************************ //

  // adding data to dataset and update
  function addData() {
      myChart.data.datasets[0].data[0] = message.payloadString;
      myChart.data.labels[0] = message.destinationName;
      myChart.update();
    }

// ************************************************************************ //

    var chartData = {
      labels: [],
      datasets: [{
        label: myChart.message.destinationName,
        data: myChart.message.payloadString,
        fill: false,
        lineTension: 0,
        radius: 2
      }]
    }

// ************************************************************************ //

 $(document).ready(function() {
   var ctx = $("#line-chartcanvas");



   var myChart = new Chart(ctx, {
     type: 'line',
     data: chartData,
     options: options
   });


 });
