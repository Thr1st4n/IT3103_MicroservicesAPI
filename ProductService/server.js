const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let products = [];
let nextProductId = 1;

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied: No Token Provided');

    try {
        // Split the token and verify the actual token
        const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'yourSecretKey'); // Secret Key from environment variable
        req.user = verified;
        next(); // Proceed if the token is valid
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}
function authorizeRole(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send('Access Denied: Insufficient Permissions');
        }
        next();
    };
}

app.post('/products', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const product = { id: nextProductId++, ...req.body };
    products.push(product);
    res.status(201).json(product);
});


app.get('/products', authenticateToken, (req, res) => {
    res.json(products);
});

app.get('/products/:productId', authenticateToken, (req, res) => {
    const product = products.find(p => p.id == req.params.productId);
    product ? res.json(product) : res.status(404).send('Product not found');
});


app.put('/products/:productId', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const product = products.find(p => p.id == req.params.productId);
    if (product) {
        Object.assign(product, req.body);
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});


app.delete('/products/:productId', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const productIndex = products.findIndex(p => p.id == req.params.productId);
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Product not found');
    }
});

app.listen(3001, () => console.log('Product Service running on port 3001'));

