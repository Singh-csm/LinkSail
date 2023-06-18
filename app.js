const express = require('express');
const app = express();
app.use(express.json());

const route = require('./src/routes/routes');
app.use('/', route);

const mongoose = require('mongoose');
const mongooseConnectionString = 'mongodb+srv://mnu4513:1234qwer@firstcluster.daae6aq.mongodb.net/mnu4513-DB';
mongoose.connect(mongooseConnectionString).then((result) => {
    console.log('mongoDB connected');
}).catch((err) => {
    console.log(err);
});

app.listen(3000, () => console.log('listening on port 3000'));