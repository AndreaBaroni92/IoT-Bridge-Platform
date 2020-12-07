const { InfluxDB } = require('@influxdata/influxdb-client')
const { ChecksAPI, OrgsAPI } = require('@influxdata/influxdb-client-apis')
const { url, org, token } = require('./env')
const influxDB = new InfluxDB({ url, token })

function controlla(checPresente, chekDaInserire) {

    if (checPresente.name == chekDaInserire) {
        throw checPresente.id
    }

}
getChek()
async function getChek() {


    try {
        let orgsAPI = new OrgsAPI(influxDB)
        let organizations = await orgsAPI.getOrgs({ org })
        if (!organizations || !organizations.orgs || !organizations.orgs.length) {
            console.error(`No organization named "${org}" found!`)
        }
        let orgID2 = organizations.orgs[0].id
        //console.log(orgID2);
        let check_ris1 = new ChecksAPI(influxDB)
        let risultato2 = await check_ris1.getChecks({ orgId :orgID2 })
        console.log(risultato2.checks[0].query.builderConfig.functions);
      /*  try {
            risultato2.checks.forEach(elem => controlla(elem, chekDaInserire))
            console.log("Il check con il nome va bene");
            
        } catch (error) {
            console.log(error);
            console.log("Chek verrà eliminato");

            try {
                await check_ris1.deleteChecksID({ checkID: error })
                console.log("Eliminato");
                
            } catch (error) {
                console.log("Errore nell'eliminazione");
            }

        }*/

    } catch (error) {

        console.log(error);
    }


}

