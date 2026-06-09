const express = require('express');
const router = require('./router/index.route');
const connectDB = require('./config/db');
const app = express();
app.use(express.json());

connectDB();

app.use('/', router);

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));