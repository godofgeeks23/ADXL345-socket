const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static HTML/JS
app.use(express.static('public'));

// Change this to your port (e.g., COM3 on Windows or /dev/ttyUSB0 on Linux)
const port = new SerialPort.SerialPort({
  path: '/dev/ttyACM0',
  baudRate: 9600
});
const parser = port.pipe(new Readline.ReadlineParser());

parser.on('data', (line) => {
  const [pitch, roll] = line.trim().split(',').map(Number);
  if (!isNaN(pitch) && !isNaN(roll)) {
    io.emit('sensor-data', { pitch, roll });
    console.log({ pitch, roll });
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
