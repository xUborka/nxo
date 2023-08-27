const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const User = require('./models/User.js');
require("dotenv").config()
const app = express();

cors_config = cors({
    credentials: true,
    origin: [
        "http://localhost:5173",
        "https://nxo-project.web.app"
    ]
})

app.use(express.json());
app.use(cookieParser());
app.use(cors_config);

mongoose.connect(process.env.MONGO_URL);

app.options('*', cors_config)

app.get("/api/test", (req, res) => {
    res.json("test ok");
})

app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({
            name, email, password: bcrypt.hashSync(password, 10)
        });
        res.json(user);
    } catch (e) {
        res.status(422).json(e);
    }
})

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userDoc = await User.findOne({ email });
        if (userDoc) {
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (passOk) {
                jwt.sign({
                    email: userDoc.email,
                    id: userDoc._id
                }, process.env.JWT_SECRET, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie(
                        "token",
                        token
                    ).json({
                        name: userDoc.name,
                        email: userDoc.email,
                        _id: userDoc._id
                    }); // TODO: options!
                });
            } else {
                res.json(false)
            }
        }
    } catch (e) {
        res.status(422).json(e);
    }
})

app.post("/api/logout", async (req, res) => {
    res.cookie("token", "").json(true);
})

app.get("/api/profile", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
})

const port = parseInt(process.env.PORT) || 8080;
app.listen(port);