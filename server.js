// const express = require('express')
// const morgan = require('morgan')
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');

// dotenv.config();

// connectDB();

// const app = express();

// app.use(express.json());
// app.use(morgan("dev"));

// app.get("/", (req, res) => {
//     res.status(200).send({
//         message: "server running",
//     });
// });

// const port = process.env.PORT || 8080

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// })