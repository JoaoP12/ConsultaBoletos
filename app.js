const express = require('express');
const router = require('./routes');

const app = express();
app.use(express.json());
app.use(router);

app.listen(3000,  function () {
    console.log("Server listening at http://localhost:3000");
});

module.exports = app;