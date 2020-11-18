const axios = require('axios');

exports.read_http =  function (http_url, port_http) {

  return new Promise(function (resolve, reject) {


    let input_url = new URL(http_url);
    input_url.port = port_http;

    axios.get(input_url.href)
      .then(function (response) {
        let ris = (response.data).toString()
        console.log(ris)
        resolve(ris)
      }).catch(function (error) {
        console.log('Error: ', error.message);
        reject(error.message)
      });

  })

};
/*
read('http://localhost', 3001).then(function (val) {
  console.log("Valore " + val);
}).catch(function (error) {
  console.log('Errore nella gestione della promessa: ', error);
});
*/
