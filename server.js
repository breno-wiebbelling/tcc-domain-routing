const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const userCustomRouter = express.Router();
const defaultRouter = express.Router();

const BASE_URL_HOST = "https://tcc-back-end.vercel.app"
//http://localhost:8080",

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

defaultRouter.get('/', (req,res) => {
  res.send('Default')
})

app.use((req, res, next) => {
  const subdomains = req.hostname.split('.');
  console.log(subdomains)
  let hostSize = ((subdomains[subdomains.length-1]) === 'localhost') ? 1 : 2;

  if(subdomains.length>hostSize){
    return userCustomRouter(req, res, next);
  }
  else{
    return defaultRouter(req, res, next);
  }
});

app.get('/', (req,res)=>{
  res.send('ok')
})

let SERVER_PORT = 8083;
app.listen(SERVER_PORT, () => {
  console.log(`Server domain-routing is running on port ${SERVER_PORT}`);
});
