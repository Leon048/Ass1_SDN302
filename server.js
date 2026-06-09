const express = require('express');
const app = express();

const connectDB = require("./config/db");
connectDB();

app.use(express.json());

const router = require('./src/route/index');
app.use('/',router);

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));