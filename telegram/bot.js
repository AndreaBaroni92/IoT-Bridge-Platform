// Il seguente bot si occupa di visualizzare su un bot telegream i risultati del sensore dht11 tramite i 
// comandi temperature e umidity
const Telegraf = require('telegraf')
const TOKEN = '' //token del bot telegram
const bot = new Telegraf(TOKEN)
const read = require('./../display.js')
const util = require('./../util.js')


//spedisci("localhost", 1883, "temperature")
start()

function start() {
  try {
    spedisci("localhost", 1883, "#")
  } catch (error) {
    console.log("Errore nel settaggio bot telegram");
  }

}

async function spedisci(hostMqtt, portMqtt, topicMqtt, min, max) {
  let t, m, data, temp, hum;

  let display = new read.ReadProtocol(hostMqtt, portMqtt, topicMqtt, min, max)


  bot.command('temperature', (ctx) => { typeof temp == 'undefined' ? ctx.reply("Temp non disponibile") : ctx.reply(temp) })
  bot.command('humidity', (ctx) => { typeof hum == 'undefined' ? ctx.reply("Hum non disponibile") : ctx.reply(hum) })
  try {
    await bot.launch()
  } catch (error) {
    console.log("Errore nell'avviamento del bot");
  }

  display.read_mqtt((stream_r) => {
    stream_r.on('readable', () => {
      while (data = stream_r.read()) {
        t = data.topic.toString();
        m = data.message.toString();
        if (util.test(parseFloat(m), min, max)) { //filtra i dati se necessario

          if (t === 'sensor/temperature') {
            temp = m
          }
          else if (t === 'sensor/humidity') {
            hum = m
          }
          else {
            console.log("Topic " + t + " non gestito");
          }
        }
      }
    })
  })
}
