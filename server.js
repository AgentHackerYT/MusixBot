const express = require('express');
const { Player } = require('./dashboard.js');
const app = express();
app.get("/play" , (req , res) => {
    Player({channel: req.query.channel , guild: req.query.guild , query: req.query.search})
})
app.post("/play" , (req , res) => {
    Player({channel: req.query.channel , guild: req.query.guild , query: req.query.search})
})
app.listen(8080) 
