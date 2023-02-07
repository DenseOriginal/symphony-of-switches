#include "BNO055_support.h"        //Contains the bridge code between the API and Arduino
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

HTTPClient http;
WiFiClient client;

String SSID = "iot";
String PSK = "mrfunkfunk";

struct bno055_t myBNO;
struct bno055_linear_accel myEulerData; //Structure to hold the Euler data

unsigned long lastTime = 0;

const int numReadings = 10;
int readings[numReadings];
int idx = 0;
int total = 0;
int average = 0;

void setup() //This code is executed once
{
  //Initialize I2C communication
  Wire.begin();

  //Initialization of the BNO055
  BNO_Init(&myBNO); //Assigning the structure to hold information about the device

  //Configuration to NDoF mode
  bno055_set_operation_mode(OPERATION_MODE_NDOF);

  delay(1);

  //Initialize the Serial Port to view information on the Serial Monitor
  Serial.begin(115200);

  for (int i = 0; i < numReadings; i++) {
    readings[i] = 0;
  }

  WiFi.mode(WIFI_STA);
  
  Serial.println("Hello!");
  WiFi.hostname("Afstand");
  WiFi.begin(SSID, PSK);

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() //This code is looped forever
{
  if ((millis() - lastTime) >= 50) //To stream at 10Hz without using additional timers
  {
    lastTime = millis();

    bno055_read_linear_accel_xyz(&myEulerData);            //Update Euler data into the structure
    int squareSum = pow(myEulerData.x, 2) + pow(myEulerData.y, 2) + pow(myEulerData.z, 2);
    int reading = sqrt(squareSum);

    

    // Keep a running total of the readings
    total = total - readings[idx];
    readings[idx] = reading;
    total = total + readings[idx];

    // Increment the idx for the next loop
    idx = (idx + 1) % numReadings;

    // Calculate the average
    average = total / numReadings;


    if (reading > 200) {
      int dataToSend = map(constrain(average, 200, 6000), 200, 6000, 0, 255);
      Serial.print(reading);
      Serial.print(", ");
      Serial.print(dataToSend);
      Serial.print(", ");
      Serial.println(average);
      
      if (dataToSend > 3) {
        sendData(5, dataToSend);
      }
    }
  }
}

void sendData(int id, int value) {
  http.begin(client, "http://192.168.1.100:1337");
  http.POST(String(id) + "," + String(value));
  http.end();
}