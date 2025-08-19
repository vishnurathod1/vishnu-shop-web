const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Import products routes
const productsRoutes = require('./routes/products');
app.use('/api/products', productsRoutes);

app.get('/', (req, res) => {
  res.send('E-commerce backend server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
