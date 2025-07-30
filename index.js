const express = require('express');
const mongoClient = require('./db/mongoose');
const mainRouter = require('./api/routes');
const app = express();
const port = process.env.PORT || 3000;

async function startServer() {
    await mongoClient.connect();

    app.use(express.json()); // ✅ اول این بیاد
    app.use(express.urlencoded({ extended: true }));

    app.get('/test', (req, res) => {
        res.send(`The time is ${new Date().toString()}`);
    });

    app.use(mainRouter); // ✅ بعد از json parser

    app.listen(port, "0.0.0.0", () => {
        console.log("Server is up on port " + port);
    });
}

startServer();
