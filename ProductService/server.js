const express = require('express');
const app = express();
app.use(express.json());

let products = [];
let nextProductId = 1;


app.post('/products', (req, res) => {
    const product = { id: nextProductId++, ...req.body };
    products.push(product);
    res.status(201).json(product);
});


app.get('/products/:productId', (req, res) => {
    const product = products.find(p => p.id == req.params.productId);
    product ? res.json(product) : res.status(404).send('Product not found');
});


app.put('/products/:productId', (req, res) => {
    const product = products.find(p => p.id == req.params.productId);
    if (product) {
        Object.assign(product, req.body);
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});


app.delete('/products/:productId', (req, res) => {
    const productIndex = products.findIndex(p => p.id == req.params.productId);
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Product not found');
    }
});

app.listen(3001, () => console.log('Product Service running on port 3001'));
