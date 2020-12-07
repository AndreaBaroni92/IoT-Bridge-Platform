const { InfluxDB } = require('@influxdata/influxdb-client')
const { NotificationRulesAPI, OrgsAPI, NotificationEndpointsAPI } = require('@influxdata/influxdb-client-apis')

const { url, org, token } = require('./env')
const influxDB = new InfluxDB({ url, token })

function controlla(checPresente, chekDaInserire) {

    if (checPresente.name == chekDaInserire) {
        throw checPresente.id
    }
}


async function createrule(api, ruleName, orgID2, endpointName) {

    try {
        let endpId = await fetchEndpointId(endpointName, orgID2)
        let ruleObj = {
            endpointID: endpId,
            name: ruleName,
            orgID: orgID2,
            status: 'active',
            every: '30s',
            offset: '0s',
            statusRules: [{ currentLevel: 'CRIT', previousLevel: null }],
            tagRules: [],
            type: 'telegram',
            messageTemplate: 'Notification Rule: `${ r._notification_rule_name }` triggered by check: `${ r._check_name }`: `${ r._message }`'
        }
        try {

            let ris_createrule = await api.createNotificationRule({ body: ruleObj })
            console.log(ris_createrule)
        } catch (error_not) {
            console.log("errore nella creazione della notification rule")
            console.log(error_not)
        }


    } catch (error) {
        console.log("Errore endpoint non trovato ");
        console.log(error);

    }

}

async function fetchEndpointId(name, orgId2) {

    return new Promise(async (res, rej) => {

        let apiEndpoint = new NotificationEndpointsAPI(influxDB)

        try {

            let nots = await apiEndpoint.getNotificationEndpoints({ orgID: orgId2 })

            try {

                nots.notificationEndpoints.forEach(elem => controlla(elem, name))
                rej("notFind")

            } catch (trovatoId) {

                res(trovatoId)

            }

        } catch (error) {
            console.log("Errore nel recupero della lista degli endpoint")
            console.log(error);
            rej(error)
        }

    })

}
async function recreateRule(regolaDaInserire, endpointName) {
    try {
        let notificationRulesAPI = new NotificationRulesAPI(influxDB)
        let orgsAPI = new OrgsAPI(influxDB)
        let organizations = await orgsAPI.getOrgs({ org })
        if (!organizations || !organizations.orgs || !organizations.orgs.length) {
            console.error(`No organization named "${org}" found!`)
        }
        let orgID2 = organizations.orgs[0].id

        let ris = await notificationRulesAPI.getNotificationRules({ orgID: orgID2 })
        console.log(ris);
        try {
            ris.notificationRules.forEach(elem => controlla(elem, regolaDaInserire))
            console.log("Regola " + regolaDaInserire + " non presente")
            createrule(notificationRulesAPI, regolaDaInserire, orgID2, endpointName)
        } catch (error2) {
            console.log("Rule presente: id =  ")
            console.log(error2)
            console.log("la rule verra' eliminata e ricreata");
            try {
                await notificationRulesAPI.deleteNotificationRulesID({ ruleID: error2 })
                console.log("Eliminato");
                createrule(notificationRulesAPI, regolaDaInserire, orgID2, endpointName)
            } catch (error3) {
                console.log(error3);

            }

        }

        //console.log(ris);

    } catch (error) {
        console.log(error);
    }

}

recreateRule("provaRegola", "endpointTel")