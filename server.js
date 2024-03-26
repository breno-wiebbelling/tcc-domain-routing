const express = require('express');
const app = express();

const userCustomRouter = express.Router();
const defaultRouter = express.Router();

userCustomRouter.get('/', (req, res) => {
  res.send('Hello from originalAppName.userCustomRouter.com');
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
  console.log(`Server is running on port ${SERVER_PORT}`);
});
