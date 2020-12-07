const express = require('express')
const app = express()
const port = 3003
app.use(express.json()) 
app.post('/prova', function (req, res) {
    console.log(req.body);
    res.send("ok")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/prova`)
})