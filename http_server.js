const express = require('express')
const app = express()
const port = 3001

app.get('/andrea', (req, res) => {
  res.set('Content-Type', 'text/plain')
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})