const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));


const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})