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
  const parts = req.hostname.split('.');
  const subdomain = parts[parts.length-2];

  switch (subdomain) {
    case 'routes':
      return userCustomRouter(req, res, next);
    default:
      return defaultRouter(req, res, next);
  }  
});

let SERVER_PORT = 8090;
app.listen(8090, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
