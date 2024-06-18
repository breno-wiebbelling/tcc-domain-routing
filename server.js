const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const userCustomRouter = express.Router();

const BASE_URL_HOST = process.env.BACKEND_HOST

const getUserHostName = (req) => {
  return req.hostname.split('.')[0]
}

const obtainHttpCall = (req) => {
  let uri = `${BASE_URL_HOST}/simulation/simulationResult`
  let method = req.method;
  let userHost = getUserHostName(req);

  if(req.originalUrl === "/favicon.ico"){
    return () => {}
  }
  
  switch(method){
    case "POST":
      return () => {
          return axios.post(
            uri, 
            { uri: req.originalUrl, userHost: userHost, body: JSON.stringify(req.body) }
          )
        }
    default:
      return () => {
          return axios.get(
            uri,
            { 
              headers: { 
                httpfeed: JSON.stringify({ uri: req.originalUrl, userHost: userHost }) 
              } 
            }
          )
        }
  }
}

userCustomRouter.use('*', async (req, res) => {
  try{
    let httpCall = obtainHttpCall(req);
    
    try{
      let response = await httpCall();
      res.send(response['data']['simulationResult']);
    }catch(err){
      res.status(500)
        .send( 
          typeof err['response'] === "undefined" 
            ? "Algo errado aconteceu. Tente novamente mais tarde!"
            : String(err['response']['data']['error'])
        )
    }
  }
  catch(e){
    res.send(e.message)
  }
});

app.use((req, res, next) => {
  return userCustomRouter(req, res, next);
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON');
    return res.status(400).send("Request inválido!");
  }
  next();
});

let SERVER_PORT = 8083;
app.listen(SERVER_PORT, () => {
  console.log(`Server domain-routing is running on port ${SERVER_PORT}`);
});
