var coap = require('coap')
  , server = coap.createServer()

server.on('request', function (req, res) {

  res.end(((Math.random() * 3) + 21).toFixed(2).toString(), "UTF-8")

})

// the default CoAP port is 5683
server.listen(5683, function () {
  console.log('server started')
})