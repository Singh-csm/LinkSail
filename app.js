const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors())

const route = require('./src/routes/routes');
app.use('/', route);

const mongoose = require('mongoose');
const mongooseConnectionString = 'mongodb+srv://mnu4513:1234qwer@firstcluster.daae6aq.mongodb.net/mnu4513-DB';
mongoose.connect(mongooseConnectionString).then((result) => {
    console.log('mongoDB connected');
}).catch((err) => {
    console.log(err);
});

const port = 3000;
app.listen(port, () => console.log('listening on port 3000'));