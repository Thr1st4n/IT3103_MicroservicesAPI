const express = require('express');
const jwt = require('jsonwebtoken');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();


function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied: No Token Provided');

  try {
    const verified = jwt.verify(token, 'yourSecretKey');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}


app.use('/customer', authenticateToken, (req, res) => {
  proxy.web(req, res, { target: 'http://localhost:3002/' });
});

app.use('/order', authenticateToken, (req, res) => {
  proxy.web(req, res, { target: 'http://localhost:3003/' });
});

app.use('/product', authenticateToken, (req, res) => {
  proxy.web(req, res, { target: 'http://localhost:3001/' });
});

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});