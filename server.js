const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});    
app.use(
  cors({
    origin: ["https://bookstore-1-ooja.onrender.com", "http://localhost:3000"],
    credentials: true,
    optionSuccessStatus:200 
  })
);

// Import routes
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');
// Use routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cart', cartRoutes); // Mount the cart routes


app.get('/', (req, res) => {
    res.send('Hello, this is your Express app!');
  });
  

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
