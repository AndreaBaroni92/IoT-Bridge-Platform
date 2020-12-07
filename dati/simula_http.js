const express = require('express')
const app = express()
const port = 3001


app.get('/'+'temperature', (req, res) => {

  res.set('Content-Type', 'text/plain')
  res.send(((Math.random() * 10)+ 21).toFixed(2).toString())
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/temperature`)
})

