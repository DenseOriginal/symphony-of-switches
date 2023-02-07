#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>

HTTPClient http;
WiFiClient client;

String SSID = "iot";
String PSK = "mrfunkfunk";

int id = 4;
int dataToSend = 0;
int previous;


void setup() 
{
  Serial.begin(115200);
  Serial.print("e");
  pinMode(A0, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);

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

// // // // // // // // // // //
void loop(void) 
{
  //Serial.print("analog: ");
  //Serial.println(analogRead(A0));
  

  delay(10);
  dataToSend = analogRead(A0)/4 -1;
  //Serial.print("data: ");
  //Serial.println(dataToSend);

  if(analogRead(A0) < previous-20 || analogRead(A0) > previous+20)
  {
    dataToSend = analogRead(A0)/4 - previous/4;
    if(dataToSend < 0)
    {
      dataToSend = dataToSend * -1;
    }
    sendData(id, dataToSend);
  }
  previous = analogRead(A0);
  
}

// // // // // // // // // // //

void sendData(int id, int value) 
{
  Serial.print("---sent: ");
  Serial.println(value);
  http.begin(client, "http://192.168.1.100:1337");
  http.POST(String(id) + "," + String(value));
  http.end();
}
