const { exec } = require('child_process');


// Start ProductService
exec('node product-service/server.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting Product Service: ${err.message}`);
    }
    console.log(`Product Service: ${stdout}`);
});

// Start CustomerService
exec('node customer-service/server.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting Customer Service: ${err.message}`);
    }
    console.log(`Customer Service: ${stdout}`);
});

// Start OrderService
exec('node order-service/server.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting Order Service: ${err.message}`);
    }
    console.log(`Order Service: ${stdout}`);
});
