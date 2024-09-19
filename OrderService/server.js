const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

let orders = [];
let nextOrderId = 1;


app.post('/orders', async (req, res) => {
    const { customerId, productId } = req.body;

    
    try {
        await axios.get(http://localhost:3002/customers/${customerId});
    } catch {
        return res.status(400).send('Invalid customer ID');
    }

  
    try {
        await axios.get(http://localhost:3001/products/${productId});
    } catch {
        return res.status(400).send('Invalid product ID');
    }

    const order = { id: nextOrderId++, customerId, productId };
    orders.push(order);
    res.status(201).json(order);
});


app.get('/orders/:orderId', (req, res) => {
    const order = orders.find(o => o.id == req.params.orderId);
    order ? res.json(order) : res.status(404).send('Order not found');
});


app.put('/orders/:orderId', (req, res) => {
    const order = orders.find(o => o.id == req.params.orderId);
    if (order) {
        Object.assign(order, req.body);
        res.json(order);
    } else {
        res.status(404).send('Order not found');
    }
});


app.delete('/orders/:orderId', (req, res) => {
    const orderIndex = orders.findIndex(o => o.id == req.params.orderId);
    if (orderIndex !== -1) {
        orders.splice(orderIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Order not found');
    }
});

app.listen(3003, () => console.log('Order Service running on port 3003'));