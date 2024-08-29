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

//protected route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ message: "Inloggad på skyddad server"});
})

//validate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null) {
        res.status(401).json({ message: "not authorized"});
    }

    jwt.verify(token, process.env.JWT_KEY, (err, username) => {
        if(err) {
            return res.status(403).json({ message: "invalid jwt"});
        }

        req.username = username;
        next();
    });
}

app.listen(port, () => {
    console.log(`Servern är igång på localhost:${port}`)
} )