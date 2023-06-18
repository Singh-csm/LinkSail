const express = require('express');
const redis = require('redis');
const shortid = require("shortid");
const app = express();
app.use(express.json());

const client = redis.createClient({
    url : "redis://default:TQEczrbJWuzX3inf50JPiezOzXlrIsX9@redis-16953.c212.ap-south-1-1.ec2.cloud.redislabs.com:16953"
})

client.connect();

client.on("connect", ()=> console.log("Connected to redis...!"))


app.post("/post" , async(req, res)=>{
    let data = req.body;
    let urlCode = shortid.generate();
    let baseUrl = req.protocol + "://" + req.get("host");
    let shortUrl = baseUrl + "/" + urlCode;
    let cachedData = await client.set(urlCode, JSON.stringify(data));
    res.send({data:cachedData, urlcode : urlCode, shortUrl: shortUrl});
});

app.get("/get/:result", async (req, res) => {
    let result = req.params.result;
    let data = await client.get(result);
    if (!data) {
        res.status(404).send({ error: "Data not found" });
        return;
    }
    let sendData = JSON.parse(data);
    res.send({ data: sendData });
});

app.listen(3000, ()=> console.log('listening on port 3000'));