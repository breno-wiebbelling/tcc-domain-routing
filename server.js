const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const userCustomRouter = express.Router();
const defaultRouter = express.Router();

const BASE_URL_HOST = process.env.BACKEND_HOST

const getUserHostName = (req) => {
  return req.hostname.split('.')[0]
}

const obtainHttpCall = (req) => {
  let uri = `${BASE_URL_HOST}/simulation/simulationResult`
  let method = req.method;
  let userHost = getUserHostName(req);

  console.log("original: "+req.originalUrl)
  if(req.originalUrl === "/favicon.ico"){
    return () => {}
  }

  console.log("uri"+uri)

  switch(method){
    case "POST":
      return () => {
          return axios.post(
            uri, 
            { uri: req.originalUrl, userHost: userHost, body: req.body }
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

userCustomRouter.use('*',async (req, res) => {
  try{
    let httpCall = obtainHttpCall(req);
    
    let response = await httpCall();
    res.send(response['data']['simulationResult']);
  }
  catch(e){
    res.send(e.message)
  }
});

app.use((req, res, next) => {
  return userCustomRouter(req, res, next);
});

let SERVER_PORT = 8083;
app.listen(SERVER_PORT, () => {
  console.log(`Server domain-routing is running on port ${SERVER_PORT}`);
});
