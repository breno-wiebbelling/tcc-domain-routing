const express = require('express');

const app = express();

// Define routers for each host
const originalRouter = express.Router();
const userCustomRouter = express.Router();

// Define routes for the originalAppName.com
originalRouter.get('/', (req, res) => {
  res.send('Hello from originalAppName.com');
});

// Define routes for the originalAppName.userCustomRouter.com
userCustomRouter.get('/', (req, res) => {
  res.send('Hello from originalAppName.userCustomRouter.com');
});

app.use((req, res, next) => {

  console.log('Here')

  const parts = req.hostname.split('.');
  const subdomain = parts[0];

  console.log(subdomain)
  console.log(subdomain == 'breno')

  switch (subdomain) {
    case 'breno':
      return originalRouter(req, res, next);
    case 'usercustom':
      return userCustomRouter(req, res, next);
    default:
      res.status(404).send('Not Found');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
