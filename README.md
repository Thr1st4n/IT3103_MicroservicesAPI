# IT3103_MicroservicesAPI 
by: Regis, Thristan Jade 
    Mariano, Luis Emmanuel 

How to start : npm start at main.js, this will run the three services. 

In postman: 
1. Testing the Product Service
Base URL: http://localhost:3001

Add a New Product (POST)

Method: POST
URL: http://localhost:3001/products

{
  "name": "Product1",
  "price": 100
}

Get Product Details by ID (GET)

Method: GET
URL: http://localhost:3001/products/:productId
Replace :productId with the ID of the product you want to retrieve.

Update a Product (PUT)

Method: PUT
URL: http://localhost:3001/products/:productId

Delete a Product (DELETE)

Method: DELETE
URL: http://localhost:3001/products/:productId
Replace :productId with the ID of the product you want to delete.


2. Testing the Customer Service
Base URL: http://localhost:3002

Add a New Customer (POST)

Method: POST
URL: http://localhost:3002/customers

{
  "name": "Customer1",
  "email": "customer1@example.com"
}

Get Customer Details by ID (GET)

Method: GET
URL: http://localhost:3002/customers/:customerId
Replace :customerId with the ID of the customer you want to retrieve.

Update a Customer (PUT)

Method: PUT
URL: http://localhost:3002/customers/:customerId

{
  "name": "UpdatedCustomer",
  "email": "updatedcustomer@example.com"
}

Delete a Customer (DELETE)

Method: DELETE
URL: http://localhost:3002/customers/:customerId
Replace :customerId with the ID of the customer you want to delete.


3. Testing the Order Service
Base URL: http://localhost:3003

Create a New Order (POST)

Method: POST
URL: http://localhost:3003/orders

{
  "customerId": 1,
  "productId": 1
}

Get Order Details by ID (GET)

Method: GET
URL: http://localhost:3003/orders/:orderId
Replace :orderId with the ID of the order you want to retrieve.
Update an Order (PUT)

Method: PUT
URL: http://localhost:3003/orders/:orderId

{
  "customerId": 2,
  "productId": 3
}

Delete an Order (DELETE)

Method: DELETE
URL: http://localhost:3003/orders/:orderId
Replace :orderId with the ID of the order you want to delete.