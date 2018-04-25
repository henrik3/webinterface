// This class connects to the MQTT broker

var broker = "m23.cloudmqtt.com";
var port = ; // use port for websockets
var topic = "lubcos/#"; // # is wildcard
var topicArray = new Array(); // array to hold incoming topics

var client = new Paho.MQTT.Client(broker, port, "clientID");

// set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;


// login options
var options = {
    useSSL: true,
    userName: "",
    password: "",
    onSuccess: onConnect,
    onFailure: doFail
}

// prints a message to the console when connection is made and subscribes to
// topics with QoS set to 0
function onConnect() {
  console.log("Connected to: " + broker);
  client.subscribe(topic, {qos: 0});
  console.log("Subscribed to: " + topic);
}

// if connection can not be made print error message to console
function doFail(e) {
  console.log("Connection failed: " + e);
}

// called when the client loses its connection and print a message to the console
function onConnectionLost (responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("Connection lost: " + responseObject.errorMessage);
  }
}

// when a message arrives, print the destination name (topic) and
// payloadstring (value) to the console
function onMessageArrived(message) {
  console.log(message.destinationName, message.payloadString);
  // if the index number to the topic is less than 0, add the topic to array
  if (topicArray.indexOf(message.destinationName) < 0) {
    // add new topic to array
    topicArray.push(message.destinationName);
    // get index number of variable y
    var y = topicArray.indexOf(message.destinationName);

    // create new data series for the chart
    var dataseries = {
      id: y,
      name: message.destinationName,
      data: []
    };

    lineGraph.chart.addData(dataseries);
  };

  var plotMqtt = [timeEpoch, Number(thenum)]; // create the array
    // check if received message contains a valid number and plot it
    if (validNumber(thenum)) {
      console.log("Received number is valid, will be plotted in chart");
      lineGraph.plot(plotMqtt, y);
    };
  };

  // check if it is a valid number
  function validNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  // init will be loaded once the document has loaded
  function init () {
      client.connect(options); // use options variables to connect
  }
