// This class should connect to mqtt broker, subscribe to topic and plot data to graph


var broker = 'm23.cloudmqtt.com'; // mqtt broker
var port = 35779;                 // websocket port
var topic = 'lubcos/#';           // topic to subscribe to, # for wildcard.

var myChart;
var topicArray = new Array();



// create new Paho MQTT client, connect with broker, port and client id
var client = new Paho.MQTT.Client(broker, port, "client_ID");

client.onMessageArrived = onMessageArrived;
client.onConnectionLost = onConnectionLost;

// ************************************************************************ //

// options for connecting to broker
var connectionOptions = {
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

// when message arrives it should print out topic and message to console
// if the index to the topic is < 0, it should push the topic to the array called
// mqttTopics.

function onMessageArrived(message) {
  // print out topic and data to console
  console.log("Topic: " + message.destinationName, ' | ', "Data: " + message.payloadString);

  // check if it is a new topic, if not, add to array
  if (topicArray.indexOf(message.destinationName) < 0){
    // add new topic to array
    topicArray.push(message.destinationName);
    // get the index number
    var y = topicArray.indexOf(message.destinationName);
    console.log("Topic Array: " + topicArray + " | " + "Index number: " + y);

    // create new dadta series for the chart
    var newdata = {
      id: y,
      name: message.destinationName,
      data: []
    };
    // add data to chart
    myChart.update(newdata);
  }


};



// ************************************************************************ //

// checks if the number is really a number
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

// ************************************************************************ //

// connect to client by using the information from the option variable
function init() {
  client.connect(connectionOptions);
};

// ************************************************************************ //

function plot(point, chartno) {
  console.log(point);
    var series = myChart.newData[0],
    shift = newData.data.length > 200;

      myChart.update[chartno].addPoint(point, true, shift);
};

// ************************************************************************ //

var graphOptions = {
    responsive: true,
    title: {
        display: true,
        position: "top",
        text: "LubCos H20plus II",
        fontSize: 18,
        fontColor: "#111"
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
      //  minPadding: 0.2,
      //  maxPadding: 0.2,
        title: {
          text: 'Temp °C / Humidity %',
            margin: 80
        }
      }]
    }
};

// ************************************************************************ //

    var chartData = {
      labels: ["topic"],
      datasets: [{
        label: "Topic",
        data: ["data"],
        fill: false,
        lineTension: 0,
        radius: 2
      }]
    }

// ************************************************************************ //

 $(document).ready(function() {
   var ctx = $("#line-chartcanvas");

   myChart = new Chart(ctx, {
     type: 'line',
     data: topicArray,
     options: graphOptions
   });

 });
