# ADXL345, socket.io, serialport, express

A real-time 3D visualization tool for accelerometer data from the ADXL345 sensor using Arduino, Node.js (Express), Socket.IO, and Three.js. The project streams sensor data from an Arduino over a serial connection and renders it in a web-based 3D interface.

🚀 Features - 

- Reads real-time accelerometer data from ADXL345 via Arduino
- Communicates over serial using serialport
- Serves data through an Express backend
- Streams live data to the frontend using Socket.IO
- Displays 3D orientation using Three.js
- Data smoothing using alpha blending

## Demo - 

https://github.com/user-attachments/assets/fb045dfb-5d15-4d08-8039-6a8b22e64d7c

https://github.com/user-attachments/assets/5b6d544a-e793-412c-978e-823499305a66

🧰 Tech Stack

- Arduino (Uno) with ADXL345

- Node.js with:
    - Express (API & web server)
    - SerialPort (read Arduino data)
    - Socket.IO (real-time communication)

- Frontend:
    - HTML/CSS/JavaScript
    - Three.js (3D graphics)
