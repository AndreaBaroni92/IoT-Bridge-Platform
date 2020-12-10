const { InfluxDB } = require('@influxdata/influxdb-client')
const { ChecksAPI, OrgsAPI } = require('@influxdata/influxdb-client-apis')
const { url, org, token } = require('./env')
const influxDB = new InfluxDB({ url, token })

function controlla(checPresente, chekDaInserire) {

    if (checPresente.name == chekDaInserire) {
        throw checPresente.id
    }

}

async function recreatechek(chekDaInserire) {


    try {
        let orgsAPI = new OrgsAPI(influxDB)
        let organizations = await orgsAPI.getOrgs({ org })
        if (!organizations || !organizations.orgs || !organizations.orgs.length) {
            console.error(`No organization named "${org}" found!`)
        }
        let orgID2 = organizations.orgs[0].id
        // console.log(orgID2);
        let check_ris1 = new ChecksAPI(influxDB)
        let risultato2 = await check_ris1.getChecks({ orgId: orgID2 })
        try {
            risultato2.checks.forEach(elem => controlla(elem, chekDaInserire))
            console.log("Il check con il nome va bene");
            createNewCheck(chekDaInserire, orgID2)
        } catch (error) {
            console.log(error);
            console.log("Chek verrà eliminato");

            try {
                await check_ris1.deleteChecksID({ checkID: error })
                console.log("Eliminato");
                createNewCheck(chekDaInserire, orgID2)
            } catch (error) {
                console.log("Errore nell'eliminazione");
            }

        }

    } catch (error) {

        console.log(error);
    }


}

async function createNewCheck(nuovoNomeCheck, orgID2) {

    const check_ris = new ChecksAPI(influxDB)

    let obj = { // oggetto che descrive il check come descritto dalle api
        name: nuovoNomeCheck,
        orgID: orgID2,
        query: {
            text: 'from(bucket: "sensor")\n' +
                '  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n' +
                '  |> filter(fn: (r) => r["_measurement"] == "dht11")\n' +
                '  |> filter(fn: (r) => r["_field"] == "temperature")\n' +                
                '  |> aggregateWindow(every: 10s, fn: mean, createEmpty: false)\n' +
                '  |> yield(name: "mean")',
            editMode: 'builder',
            name: '',
            builderConfig: {
                buckets: ['sensor'],
                tags: [
                    {
                      key: '_measurement',
                      values: [ 'dht11' ],
                      aggregateFunctionType: 'filter'
                    },
                    {
                      key: '_field',
                      values: [ 'temperature' ],
                      aggregateFunctionType: 'filter'
                    },
                    { key: '', values: [], aggregateFunctionType: 'filter' }
                  ],
                functions: [ { name: 'mean' } ],
                aggregateWindow: { period: '10s', fillValues: false }
            }


        },
        statusMessageTemplate: 'Check: ${ r._check_name } is: ${ r._level } ',
        every: '30s',
        offset: '0s',
        tags: [],
        thresholds: [
            {
                allValues: false,
                level: 'CRIT',
                value: 19,
                type: 'lesser'
            }
        ],
        type: 'threshold',
        labels: [],
        status: 'active'
    }

    try {
        let risultato = await check_ris.createCheck({ body: obj })
        console.log(risultato);

    } catch (error) {
        console.log(error);

    }

}

recreatechek('chekTemp')