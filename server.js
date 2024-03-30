const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const userCustomRouter = express.Router();
const defaultRouter = express.Router();

const BASE_URL_HOST = "http://localhost:8080"

const getUserHostName = (req) => {
  return req.hostname.split('.')[0]
}

const obtainHttpCall = (req) => {
  let uri = `${BASE_URL_HOST}/simulation/simulationResult`
  let method = req.method;
  
  console.log({ 
    httpfeed: JSON.stringify({ uri: req.params[0], userHost: getUserHostName(req) }) 
  })

  switch(method){
    case "POST":
      return () => {
          return axios.post(
            uri, 
            { uri: req.params[0], userHost: getUserHostName(req), body: req.body }
          )
        }
    default:
      return () => {
          return axios.get(
            uri,
            { 
              headers: { 
                httpfeed: JSON.stringify({ uri: req.params[0], userHost: getUserHostName(req) }) 
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

defaultRouter.get('/', (req,res) => {
  res.send('Default')
})

app.use((req, res, next) => {
  const subdomains = req.hostname.split('.');
  let hostSize = ((subdomains[subdomains.length-1]) === 'localhost') ? 1 : 2;

  if(subdomains.length>hostSize){
    return userCustomRouter(req, res, next);
  }
  else{
    return defaultRouter(req, res, next);
  }
});

let SERVER_PORT = 8090;
app.listen(8090, () => {
  console.log(`Server domain-routing is running on port ${SERVER_PORT}`);
});
