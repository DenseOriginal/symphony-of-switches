#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

HTTPClient http;
WiFiClient client;

String SSID = "iot";
String PSK = "mrfunkfunk";

int sensorPin = A0;   // select the input pin for the potentiometer
int ledPin = LED_BUILTIN;      // select the pin for the LED
int sensorValue = 0;  // variable to store the value coming from the sensor

int prev = 0;

void setup() {
  // declare the ledPin as an OUTPUT:
  pinMode(ledPin, OUTPUT);
  Serial.begin(115200);

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

void loop() {
  // read the value from the sensor:
  sensorValue = analogRead(sensorPin);
  int diff = prev - sensorValue;
  int mapped = pow(diff, 2) * 0.0003;
  Serial.println(sensorValue, mapped);

  if (mapped > 10 && diff > 0) {
    sendData(2, mapped);
  }
  delay(10);

  prev = sensorValue;
}

void sendData(int id, int value) {
  http.begin(client, "http://192.168.1.100:1337");
  http.POST(String(id) + "," + String(value));
  http.end();
}
