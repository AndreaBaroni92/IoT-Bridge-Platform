const { InfluxDB } = require('@influxdata/influxdb-client')
const { NotificationEndpointsAPI, OrgsAPI } = require('@influxdata/influxdb-client-apis')

const { url, org, token } = require('./env')
const influxDB = new InfluxDB({ url, token })

const URLENDPOINT = 'http://192.168.1.6:3006/prova'

function controlla(checPresente, chekDaInserire) {

    if (checPresente.name == chekDaInserire) {
        throw checPresente.id
    }
}

recreateEndpoint("endpointTel")

async function createEndpoint(api, endP, orgID2) {



    try {

        let ris = await api.createNotificationEndpoint({
            body: {
                authMethod: 'none', method: 'POST', name: endP,
                type: 'http', url: URLENDPOINT,
                orgID: orgID2, status: 'active'
            }
        })
        console.log("Nuovo enpoint creato il " + ris.createdAt);
    } catch (error) {
        console.log("Errore nella creazione dell'endpoint");
        console.log(error);

    }

}
async function recreateEndpoint(endpointDaInserire) {
    try {
        let notificationEndpointsAPI = new NotificationEndpointsAPI(influxDB)
        let orgsAPI = new OrgsAPI(influxDB)
        let organizations = await orgsAPI.getOrgs({ org })
        if (!organizations || !organizations.orgs || !organizations.orgs.length) {
            console.error(`No organization named "${org}" found!`)
        }
        let orgID2 = organizations.orgs[0].id

        let ris = await notificationEndpointsAPI.getNotificationEndpoints({ orgID: orgID2 })

        try {
            ris.notificationEndpoints.forEach(elem => controlla(elem, endpointDaInserire))
            createEndpoint(notificationEndpointsAPI, endpointDaInserire, orgID2)
        } catch (error2) {
            console.log("Log presente: id =  ")
            console.log(error2)
            console.log("Endpoint verra' eliminato e reinserito");
            try {
                await notificationEndpointsAPI.deleteNotificationEndpointsID({ endpointID: error2 })
                console.log("Eliminato");
                createEndpoint(notificationEndpointsAPI, endpointDaInserire, orgID2)
            } catch (error3) {
                console.log(error3);

            }

        }

        //console.log(ris);

    } catch (error) {

    }

}