#include "WiFi.h"
#include <PubSubClient.h>
#include <DHT.h>

#define PIN_DHT 4
#define DEFAULT_SENSE_FREQUENCY 2000

DHT dht(PIN_DHT, DHT11);
PubSubClient clientMQTT; 
WiFiClient clientWiFi;
const char* IP_MQTT_SERVER="";
const char* TOPIC_1 = "sensor/temperature";
const char* TOPIC_2 = "sensor/humidity";
float tempValue;
char tempString[6]; 
float humValue;
char humString[6];

boolean resultMQTT;

void setup() {
  Serial.begin(115200);
  delay(100);
  dht.begin();
  delay(100);
  connect();
  clientMQTT.setClient(clientWiFi);
  clientMQTT.setServer(IP_MQTT_SERVER,1883);
  resultMQTT=false;
}

boolean publishData(char* payload, int topic) {
  
  boolean connected=clientMQTT.connected();
  if (!connected) 
    connected=clientMQTT.connect("nodemcu");
  if (connected) {
    if (topic==0) {
      bool result=clientMQTT.publish(TOPIC_1,payload); 
      clientMQTT.loop();
      return result;
    } else {
      bool result=clientMQTT.publish(TOPIC_2,payload); 
      clientMQTT.loop();
      return result;
    }
  } else return(false);  
}

void loop() {
  Serial.print("[LOG] Read the temperature value ... ");
  tempValue=dht.readTemperature();
  delay(200);
  humValue=dht.readHumidity();
  delay(200);
  Serial.println(tempValue);
  sprintf(tempString,"%f", tempValue);
  resultMQTT=publishData(tempString, 0);
  if (resultMQTT) 
    Serial.println("[LOG] Data temp published on the MQTT server");
  else
    Serial.println("[ERROR] MQTT connection failed");
  
  sprintf(humString,"%f", humValue);
  resultMQTT=publishData(humString, 1);
  if (resultMQTT) 
    Serial.println("[LOG] Data hum published on the MQTT server");
  else
    Serial.println("[ERROR] MQTT connection failed");
  
  delay(DEFAULT_SENSE_FREQUENCY);
}



const char* SSID = "xxxxxxxxxxxxxxxxxxxxxxxx"; //fill with WiFi data
const char* PASS = "xxxxxxxxxxxxxxxxxxxxxxxxxxx"; //fill with WiFi data

void connect() {
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connection attempt");
    delay(500);
  }
  
  Serial.println("WiFi connected");
  // Start the server
  Serial.println(WiFi.localIP());
}
