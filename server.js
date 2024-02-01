const express = require('express');
const vhost = require('vhost');

const app = express();

// Define routers for each domain
const blogApp = express.Router();
const defaultRouter = express.Router();

// Routes for blogApp
blogApp.get('/', (req, res) => {
  res.send('Welcome to the blog!');
});

blogApp.get('/post/:postId', (req, res) => {
  const postId = req.params.postId;
  res.send(`Viewing blog post ${postId}`);
});

// Routes for defaultRouter
defaultRouter.get('/', (req, res) => {
  res.send('Welcome to the default route!');
});

defaultRouter.get('/about', (req, res) => {
  res.send('About page');
});

// Use vhost middleware to handle different subdomains with different routers
app.use(vhost('blog.localhost', blogApp));
app.use(vhost('*.localhost', defaultRouter));

// The rest of your Express app setup and server listening code
const port = 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
