# IoT-Bridge-Platform
## Requisiti
- [coap](https://github.com/mcollina/node-coap)
- [mqtt](https://github.com/mqttjs/MQTT.js)
- [axios](https://github.com/axios/axios)
- [express](https://expressjs.com/)
- [telegraf](https://telegraf.js.org/)
- [yargs](https://github.com/yargs/yargs)
## Esempi
Per avere un' informazione generale del progetto digitare:
```
node .\main.js --help
```
Per avere informazioni sui singoli comandi (visualize, save, translate) digitare ad esempio:
```
node .\main.js save --help
```
I dati forniti dai protocolli http coap e mqtt si assume consistano in un singolo valore numerico come può essere quello prodotto da un sensore.  
### visualizzazione  
Per simulare dati casuali pubblicati verso un broker mqtt situato all'indirizzo localhost sulla porta 1883 è possibile digitare il seguente comando:
```
node dati/simula_mqtt.js
```
ed in seguito digitare il seguente comando in un altro terminale per la vsualizzazione  
```
node ./main.js visualize -p "mqtt" -h "localhost" -n 1883 -t "temperature"
```  
allo stesso modo per simulare un server coap è possibile digitare il seguente comando in un terminale:  
```
node dati/simula_coap.js
```  
ed in seguito digitare il seguente comando in un altro terminale per la visualizzazione  
```
node ./main.js visualize -p "coap" -h "coap://localhost" -n 5683 
```
Alternativamente è possibile produrre dati da una board esp32 con un sensore di temperature e umidità dht11 utilizzando il file dati/mqtt_sorgente.ino .  

Per la visualizzazione dal protocollo http si seguono i passaggi analoghi a quelli utilizzati per il protocollo coap.
### salvataggio  
Per salvare i dati all' interno di un database Influx 2.0 bisogna specificare un file .json con i seguenti campi:  
```json
{
    "token": "",
    "org": "",
    "bucket" : "",
    "url" : "",
    "mesurement" :"mesurement",
    "field": "field_cambiato",
    "defaultTag":"{\"chiave\": \"valore\"}"
}
```  
in seguito se i dati provengono dal protocollo mqtt digitare il seguente comando 
```
node .\main.js save -p "mqtt" -h "192.168.1.2"  -t "temperature"  -n 1883 -c file.json
```  
che salverà i dati all'interno del database specificato dal file json
### conversione
Per convertire dati provenienti da un flusso mqtt e trasformarli in un flusso dati in uscita per il protocollo http è necessario digitare il seguente comando con i parametri opportunamente settati:
```
node .\main.js translate --sp "mqtt" --sh "localhost" --sn 1883 --st "temperature" --dp "http" --dn 3004
```
Il comando sopra è usato in modo analogo per gestire tutte le altre conversioni possibili per esempio per convertire un flusso da coap a http è necessario digitare il seguente comando  con i parametri opportunamente settati:  
```
node .\main.js translate --sp "coap" --sh "coap://localhost/temperature" --sn 5683 --dp "http" --dn 8001
```  
Le altre possibili conversioni sono: mqtt -> coap , coap -> mqtt, http -> mqtt, http -> coap.
Per informazioni sulle opzioni è possibile digitare:  
```
node .\main.js translate --help
``` 
## Settaggio del database Influx 2.0  
Per la creazione del bucket, e l'impostazione dei check, degli alert e degli avvisi con i relativi endpoint è possibile utilizzare l'interfaccia grafica fornita con influx 2.0. Il file `env.js` è necessario per specificare **l'url** ,**il token** e **l'organizzazione** del database.
Alternativamente è possibile utilizzare alcuni file presenti all'interno della cartella **dati**, in particolare:  
- `createBucket.js` crea un bucket su influx, è possibile impostare il nome e la politica di retention,  
- `createCheck.js` crea un check specificato attraverso il linguaggio flux, 
- `createEndpoint.js` crea un canale di cominicazione per effettuare una post ad un particolare indirizzo, 
- `createTeleg.js` crea un canale di comunicazione che attraverso un bot telegram invia un messaggio di alert su un canale, è richiesto l'inserimento dell' id del canale e il token per il bot telegram.
- `createRule.js` crea una regola per l'invio di alert sul canale di comunicazione (endpoint). Il canale di comunicazione sul quale questa regola invia il messaggio di allerta è quello che invia una richiesta post ad un particolare indirizzo specificato dal file: `createEndpoint.js`.
- `createRuleTel.js` crea una regola per l'invio di alert sul canale di comunicazione (endpoint). Il canale di comunicazione sul quale questa regola invia il messaggio di allerta è quello gestito da telegram e specificato del file: `createTeleg.js`. Attualmente, in Influx 2.0 specificare come endpoint Telegram è possibile solo tramite API.  
All'interno della cartella **telegram** il file `alert.js` si occupa di rimanere in ascolto su un path definito dall'utente e su una particolare porta, in attesa di gestire richieste post inviate da rule definite tramite influx; l'obbiettivo è quello di inviare un messaggio di alert su un canale telegram tramite un bot. 