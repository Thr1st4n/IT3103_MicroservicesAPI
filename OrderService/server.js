const express = require('express');
const axios = require('axios');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());

let orders = [];
let nextOrderId = 1;

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied: No Token Provided');

    try {
        const verified = jwt.verify(token.split(' ')[1], secretKey);  // Token format: 'Bearer <token>'
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

app.post('/orders', authenticateToken, authorizeRole(['customer', 'admin']), async (req, res) => {
    const { customerId, productId } = req.body;


    try {
        await axios.get('http://localhost:3002/customers/${customerId}', {
            headers: { Authorization: req.header('Authorization') }
        });
    } catch {
        return res.status(400).send('Invalid customer ID');
    }


    try {
        await axios.get('http://localhost:3001/products/${productId}', {
            headers: { Authorization: req.header('Authorization') }
        });
    } catch {
        return res.status(400).send('Invalid product ID');
    }


    const order = { id: nextOrderId++, customerId, productId };
    orders.push(order);
    res.status(201).json(order);
});


app.get('/orders/:orderId', authenticateToken, (req, res) => {
    const order = orders.find(o => o.id == req.params.orderId);
    order ? res.json(order) : res.status(404).send('Order not found');
});


app.put('/orders/:orderId', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const order = orders.find(o => o.id == req.params.orderId);
    if (order) {
        Object.assign(order, req.body);
        res.json(order);
    } else {
        res.status(404).send('Order not found');
    }
});


app.delete('/orders/:orderId', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const orderIndex = orders.findIndex(o => o.id == req.params.orderId);
    if (orderIndex !== -1) {
        orders.splice(orderIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Order not found');
    }
});

app.listen(3003, () => console.log('Order Service running on port 3003'));