#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_ADXL345_U.h>

Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);
float smoothPitch = 0;
float smoothRoll = 0;
const float alpha = 0.1; // 0 < alpha <= 1, smaller = smoother

void setup() {
  Serial.begin(9600);
  if (!accel.begin()) {
    Serial.println("Ooops, no ADXL345 detected ... Check your wiring!");
    while (1);
  }
  Serial.println("ADXL345 ready!");

  // Optional: Set measurement range
  accel.setRange(ADXL345_RANGE_16_G);
}

void loop() {
  sensors_event_t event;
  accel.getEvent(&event);

  float x = event.acceleration.x;
  float y = event.acceleration.y;
  float z = event.acceleration.z;

  // Calculate pitch and roll
  float pitch = atan2(-x, sqrt(y * y + z * z)) * 180 / PI;
  float roll = atan2(y, z) * 180 / PI;

  // Apply smoothing
  smoothPitch = (1 - alpha) * smoothPitch + alpha * pitch;
  smoothRoll  = (1 - alpha) * smoothRoll  + alpha * roll;

  Serial.print(smoothPitch);
  Serial.print(",");
  Serial.println(smoothRoll);
  delay(10);

}