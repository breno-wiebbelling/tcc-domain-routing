const express = require('express');
const app = express();

const originalRouter = express.Router();
const userCustomRouter = express.Router();
const defaultRouter = express.Router();

originalRouter.get('/', (req, res) => {
  res.send('Hello from originalAppName.com');
});

userCustomRouter.get('/', (req, res) => {
  res.send('Hello from originalAppName.userCustomRouter.com');
});

defaultRouter.get('/', (req,res) => {
  res.send('Default')
})

app.use((req, res, next) => {
  const parts = req.hostname.split('.');
  console.log(parts)
  const subdomain = parts[0];

  switch (subdomain) {
    case 'breno':
      return originalRouter(req, res, next);
    case 'usercustom':
      return userCustomRouter(req, res, next);
    default:
      return defaultRouter(req, res, next);
  }  
});

app.listen(8080, () => {
  console.log(`Server is running on port`);
});
