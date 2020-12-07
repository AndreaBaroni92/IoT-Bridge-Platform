const { InfluxDB } = require('@influxdata/influxdb-client')
const { Point } = require('@influxdata/influxdb-client')
const util = require('./util.js');
const read = require('./display.js')
const EventEmitter = require('events')

function InfluxInstance(inputToken, inputOrg, inputBucket, inputUrl, inputMesurement, inputField,
    inputDefaultTag, host, port, topic, min, max) {
    this.token = inputToken
    this.org = inputOrg
    this.bucket = inputBucket
    this.url = inputUrl
    this.mesurement = inputMesurement
    this.field = inputField
    this.defaultTag = inputDefaultTag
    read.ReadProtocol.call(this, host, port, topic, min, max)
    InfluxInstance.prototype = Object.create(read.ReadProtocol.prototype)

    Object.defineProperty(InfluxInstance.prototype, 'constructor', {
        value: InfluxInstance,
        enumerable: false, // so that it does not appear in 'for in' loop
        writable: true
    });

    this.getWriteApiInflux = function () {
        const client = new InfluxDB({ url: this.url, token: this.token })
        const writeApi = client.getWriteApi(this.org, this.bucket)
        if (this.defaultTag) {
            try {
                let defaultTags = JSON.parse(this.defaultTag)
                writeApi.useDefaultTags(defaultTags)
                return writeApi
            } catch (error) {
                console.log("Errore nel parsing dei tag di default")
                return writeApi
            }

        }

    }
    this.execSaveInflux = function (writeApi, point) {

        return new Promise(function (res, rej) {

            writeApi.
                writePoint(point)
            writeApi
                .close()
                .then(() => {
                    res('FINISHED')
                    // console.log('FINISHED')
                })
                .catch(e => {
                    // console.error(e)
                    rej(e)
                    // console.log('\\nFinished ERROR')
                })

        })



    }

    this.saveInflux = async function (mesurement, field, value) {
        return new Promise(async (res, rej) => {
            const point = new Point(mesurement)
                .floatField(field, parseFloat(value))
            const writeApi = this.getWriteApiInflux()
            try {
                let ris = await this.execSaveInflux(writeApi, point)
                res(ris);
            } catch (error) {
                rej(error);
            }
        })


    }

    this.saveMqtt = function () {

        this.read_mqtt((stream_r) => {
            stream_r.on('readable', async () => {
                // There is some data to read now.
                let data;
                while (data = stream_r.read()) {
                    t = data.topic.toString();
                    m = data.message.toString();
                    try {
                        if (util.test(parseFloat(m), this.min, this.max)) { //filtra i risultati prima del salvataggio
                            let ris = await this.saveInflux(this.mesurement, this.field, m)
                            console.log(ris);
                        }
                    } catch (error) {
                        console.log("errore nel salvataggio su influx");
                        console.log(error);
                    }
                }
            });

        })

    }

    this.saveHttp = async function () {
        const eventEmitter = new EventEmitter()
        eventEmitter.on('start', async () => {

            try {

                let ris = await this.read_http()
                if (util.test(parseFloat(ris), this.min, this.max)) { //filtra i risultati prima del salvataggio
                    let ris_influx = await this.saveInflux(this.mesurement, this.field, ris)
                    console.log(ris_influx)
                }
                await util.sleep(2000) // sleeps two seconds then emits a new start event
                eventEmitter.emit('start')

            } catch (error) {
                console.log("Errore nella richiesta http o nel salvataggio su influx dettagli:")
                console.log(error)
            }

        })
        eventEmitter.emit('start')

    }

    this.saveCoap = async function () {

        const eventEmitter = new EventEmitter()

        eventEmitter.on('start', async () => {

            try {

                let ris = await this.read_coap()
                if (ris) {
                    if (util.test(parseFloat(ris), this.min, this.max)) { //filtra i risultati se passano il test

                        let ris_influx = await this.saveInflux(this.mesurement, this.field, ris)
                        console.log(ris_influx)
                    }
                }
                await util.sleep(2000) // sleeps two seconds then emits a new start event
                eventEmitter.emit('start')

            } catch (error) {
                console.log("Errore nella richiesta coap o nel salvataggio su influx")
                console.log(error)
            }

        })
        eventEmitter.emit('start')
    }

}

exports.InfluxInstance = InfluxInstance