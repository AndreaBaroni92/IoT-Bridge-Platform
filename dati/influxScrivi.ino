/**
 * Basic Write Example code for InfluxDBClient library for Arduino
 * Data can be immediately seen in a InfluxDB UI: wifi_status measurement
 * Enter WiFi and InfluxDB parameters below
 *
 * Measures signal level of the actually connected WiFi network
 * This example supports only InfluxDB running from unsecure (http://...)
 * For secure (https://...) or Influx Cloud 2 use SecureWrite example
 **/

#define DEVICE "ESP32"
#include "WiFi.h"
#include "DHT.h"
#define DHTPIN 4 
#define DHTTYPE DHT11 
#include <InfluxDbClient.h>

// WiFi AP SSID
#define WIFI_SSID "xxxxxxxxxxxx"
// WiFi password
#define WIFI_PASSWORD "xxxxxxxxxxxxx"
// InfluxDB  server url. Don't use localhost, always server name or ip address.
// E.g. http://192.168.1.48:8086 (In InfluxDB 2 UI -> Load Data -> Client Libraries), 
#define INFLUXDB_URL "http://192.168.1.8:8086"
// InfluxDB 2 server or cloud API authentication token (Use: InfluxDB UI -> Load Data -> Tokens -> <select token>)
#define INFLUXDB_TOKEN "coPEpZ3tZHMziXlzzWQv6hBqZNKnuF8heiYSO5E4sAeUmDR-EZriPALOHTUtLCfFjvUeCWw0EG4akvz0elkF8w=="
// InfluxDB 2 organization id (Use: InfluxDB UI -> Settings -> Profile -> <name under tile> )
#define INFLUXDB_ORG "IotClass"
// InfluxDB 2 bucket name (Use: InfluxDB UI -> Load Data -> Buckets)
#define INFLUXDB_BUCKET "sensore"
// InfluxDB v1 database name 
//#define INFLUXDB_DB_NAME "database"

// InfluxDB client instance
InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN);
// InfluxDB client instance for InfluxDB 1
//InfluxDBClient client(INFLUXDB_URL, INFLUXDB_DB_NAME);

// Data point
Point sensor("dht11");
DHT dht(DHTPIN, DHTTYPE);
void connect() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connection attempt");
    delay(500);
  }
  
  Serial.println("WiFi connected");
  // Start the server
  Serial.println(WiFi.localIP());
}

void setup() {
 Serial.begin(115200);
 connect();
 Serial.println(F("DHTxx test!"));
 dht.begin();
 
   // Set InfluxDB 1 authentication params
  //client.setConnectionParamsV1(INFLUXDB_URL, INFLUXDB_DB_NAME, INFLUXDB_USER, INFLUXDB_PASSWORD);

  // Add constant tags - only once
    sensor.addTag("device", DEVICE);
//  sensor.addTag("SSID", WiFi.SSID());

  // Check server connection
  if (client.validateConnection()) {
    Serial.print("Connected to InfluxDB: ");
    Serial.println(client.getServerUrl());
  } else {
    Serial.print("InfluxDB connection failed: ");
    Serial.println(client.getLastErrorMessage());
  }
}

void loop() {
  float t = dht.readTemperature();//legge la temperatura
  float h = dht.readHumidity();
  if ( isnan(t) ) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }
  // Store measured value into point
  sensor.clearFields();
  // Report RSSI of currently connected network
  sensor.addField("humidity", h);
  sensor.addField("temperature", t);
  // Print what are we exactly writing
  Serial.print("Writing: ");
  Serial.println(client.pointToLineProtocol(sensor));
  // If no Wifi signal, try to reconnect it
  if ((WiFi.RSSI() == 0) && ((WiFi.status() != WL_CONNECTED))){
    Serial.println("Wifi connection lost");
  }
  // Write point
  if (!client.writePoint(sensor)) {
    Serial.print("InfluxDB write failed: ");
    Serial.println(client.getLastErrorMessage());
  }

  //Wait 10s
  Serial.println("Wait 5s");
  delay(5000);
}
