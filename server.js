const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();



const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());


//routes
app.use("/api", authRoutes);

app.listen(port, () => {
    console.log(`Servern är igång på localhost:${port}`)
} )