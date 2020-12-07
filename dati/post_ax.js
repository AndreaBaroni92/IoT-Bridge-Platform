const axios = require('axios')
let input_url = new URL("http://192.168.1.6:3005/prova")
       
axios.post(input_url.href, {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
      console.log("Errore");
    console.log(error);
  });