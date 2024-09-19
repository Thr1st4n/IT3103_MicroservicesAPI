const express = require('express');
const app = express();
app.use(express.json());

let customers = [];
let nextCustomerId = 1;


app.post('/customers', (req, res) => {
    const customer = { id: nextCustomerId++, ...req.body };
    customers.push(customer);
    res.status(201).json(customer);
});

 
app.get('/customers/:customerId', (req, res) => {
    const customer = customers.find(c => c.id == req.params.customerId);
    customer ? res.json(customer) : res.status(404).send('Customer not found');
});

app.put('/customers/:customerId', (req, res) => {
    const customer = customers.find(c => c.id == req.params.customerId);
    if (customer) {
        Object.assign(customer, req.body);
        res.json(customer);
    } else {
        res.status(404).send('Customer not found');
    }
});


app.delete('/customers/:customerId', (req, res) => {
    const customerIndex = customers.findIndex(c => c.id == req.params.customerId);
    if (customerIndex !== -1) {
        customers.splice(customerIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Customer not found');
    }
});

app.listen(3002, () => console.log('Customer Service running on port 3002'));