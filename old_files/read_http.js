const axios = require('axios')
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()
const util = require('./util.js')
const read_http_protocol = (http_url, port_http) => new Promise(function (resolve, reject) {


  let input_url = new URL(http_url)
  input_url.port = port_http

  axios.get(input_url.href)
    .then(function (response) {
      let ris = (response.data).toString()

      resolve(ris)
    }).catch(function (error) {

      reject(error.message)
    })

})
exports.read_http = read_http_protocol
exports.visualize_http = (http_url, port_http) => {

  eventEmitter.on('start', async function () {

    try {

      let ris = await read_http_protocol(http_url, port_http)
      console.log(ris)
      await util.sleep(2000) // sleeps two seconds then emits a new start event
      eventEmitter.emit('start')

    } catch (error) {
      console.log("Errore nella richiesta http")
      console.log(error)
    }

  })
  eventEmitter.emit('start')

}


//visualize('http://localhost/andrea', 3001)

/*
read_http('http://localhost/andrea', 3001).then(function (val) {
  console.log("Valore " + val)
}).catch(function (error) {
  console.log('Errore nella gestione della promessa: ', error)
})*/

