const mqtt = require('./read_mqtt.js');
mqtt.read_mqtt('localhost',1883,'prova',function ( stream_r){
    stream_r.on('readable', () => {
        // There is some data to read now.
      let data;    
      while (data = stream_r.read()) {
        console.log(data.topic.toString() + " " + data.message.toString());
      }
    });
});