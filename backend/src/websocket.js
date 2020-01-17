const socketio = require("socket.io");
const parseStringAsArray = require("./utils/parseStringAsArray.js");
const calculateDistance = require("./utils/calculateDistance.js");

let io;
const connections = [];

exports.setupWebSocket = server => {
  io = socketio(server);

  io.on("connection", socket => {
    // setTimeout(() => {
    //   socket.emit("message", "hello omni");
    // }, 3000);

    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      techs: parseStringAsArray(techs)
    });
  });
};

exports.findConnections = (coordinates, techs) => {
  // check if the new dev is in 10 km from my distance and if it has the techs informed
  return connections.filter(connection => {
    return (
      calculateDistance(coordinates, connection.coordinates) <= 10 &&
      connection.techs.some(item => techs.includes(item))
    );
  });
};

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
};
