const express = require('express');
const app = express();
app.use(express.json());


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');


const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests, please try again later'
});


const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 5, 
    message: 'Too many login attempts, please try again later'
});

let customers = [];
let nextCustomerId = 1;


const secretKey = 'yourSecretKey';


function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied: No Token Provided');

    try {
        const verified = jwt.verify(token.split(' ')[1], secretKey);  
        req.user = verified;
        next(); 
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



app.post('/register', async (req, res) => { 
    const { username, password, role } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10); 
    const newCustomer = { id: nextCustomerId++, username, password: hashedPassword, role }; 
    customers.push(newCustomer); 
    res.status(201).json({ message: 'User registered successfully' }); 
}); 


app.post('/login', async (req, res) => { 
    const { username, password } = req.body; 
    const customer = customers.find(c => c.username === username); 
    if (customer && await bcrypt.compare(password, customer.password)) { 
        const token = jwt.sign({ id: customer.id, role: customer.role }, secretKey, { expiresIn: '1h' }); 
        res.json({ token }); 
    } else {
        res.status(401).json({ message: 'Invalid username or password' }); 
    } 
}); 


app.post('/customers', authenticateToken, (req, res) => {
    const customer = { id: nextCustomerId++, ...req.body };
    customers.push(customer);
    res.status(201).json(customer);
});

 
app.get('/customers', authenticateToken, (req, res) => {
    res.json(customers);
});



app.get('/customers/:customerId', authenticateToken, (req, res) => {
    const customer = customers.find(c => c.id == req.params.customerId);
    customer ? res.json(customer) : res.status(404).send('Customer not found');
});

app.put('/customers/:customerId', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const customer = customers.find(c => c.id == req.params.customerId);
    if (customer) {
        Object.assign(customer, req.body);
        res.json(customer);
    } else {
        res.status(404).send('Customer not found');
    }
});


app.delete('/customers/:customerId', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const customerIndex = customers.findIndex(c => c.id == req.params.customerId);
    if (customerIndex !== -1) {
        customers.splice(customerIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Customer not found');
    }
});


app.listen(3002, () => console.log('Customer Service running on port 3002'));