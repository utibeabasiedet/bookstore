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



app.use(cors({
  origin: ["http://localhost:3000","https://bookstorefrontend-e7b5.vercel.app"], // Add your frontend URLs
  credentials: true, // Allow credentials (cookies, headers, etc.)
}));

// Set headers for all routes
// Set headers for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Check if origin is present before setting the header
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow cookies
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Preflight request for CORS
  }
  
  next();
});



// Import routes
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const emailRoutes = require("./routes/emailRoutes");


// Use routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cart', cartRoutes); // Mount the cart routes
// Register the email routes
app.use("/api/mymail", emailRoutes);


app.get('/', (req, res) => {
    res.send('Hello, this is your Express app!');
  });
  

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
