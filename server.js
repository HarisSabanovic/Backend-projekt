const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();



const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());


//routes
app.use("/api", authRoutes);

app.listen(port, () => {
    console.log(`Servern är igång på localhost:${port}`)
} )