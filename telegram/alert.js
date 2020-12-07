const express = require('express')
const { Telegraf } = require('telegraf')

let prova = new TelegramBot('', '', "/prova", 3006) //specificare token BOT e token channel
prova.alert()

function TelegramBot(token_bot, token_channel, path, port) {

    this.token_bot = token_bot
    this.token_channel = token_channel
    this.path = path
    this.port = port

    this.alert = function () {

        let app = express()
        let bot = new Telegraf(this.token_bot)
        app.use(express.json())
        app.post(this.path, async (req, res) => {
            try {
                await bot.telegram.sendMessage(this.token_channel, req.body._message)
               // console.log(req.body);
                res.send("ok")
            } catch (error) {
                console.log("Errore nell'invio del bot telegram");
            }

        })

        app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}/prova`)
        })

    }


}