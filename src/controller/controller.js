// importing dependencies :- 
const redis = require('redis');
const shortid = require('shortid');
const urlModel = require('../model/model');


// setting-up redis environment :-
const client = redis.createClient({
    url: "redis://default:TQEczrbJWuzX3inf50JPiezOzXlrIsX9@redis-16953.c212.ap-south-1-1.ec2.cloud.redislabs.com:16953"
});
client.connect();
client.on("connect", () => console.log("Connected to redis...!"));


// route handler to generate the shortUrl and urlCode :- 
const shortTheUrl = async function (req, res) {
    try {
        const data = req.body;
        const { mainUrl } = data;

        // checking data on db :- 
        const dataOnDb = await urlModel.findOne({ mainUrl: mainUrl });

        // if data with this main url is already present on db :- 
        if (dataOnDb) {
            // storing data in redis cache :- 
            await client.set(dataOnDb.shortUrl, JSON.stringify(dataOnDb));
            // sending response :-
            return res.stauts(200).send({ status: true, data: dataOnDb });
        };

        // else if data with this main url is not present on db :- 

        // generating url code and short url using 'shortid' package :- 
        let urlCode = shortid.generate();
        let baseUrl = req.protocol + "://" + req.get("host");
        let shortUrl = baseUrl + "/" + urlCode;

        data.urlCode = urlCode;
        data.shortUrl = shortUrl;

        // storing data on db :- 
        const dataStoredOnDb = await urlModel.create(data);

        // storing data on db :- 
        await client.set(urlCode, JSON.stringify(data));

        // sending response to the client :- 
        res.status(201).send({status: true,  data: dataStoredOnDb});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};


// route handler to get the main url :- 
const getTheMainUrl = async function (req, res) {
    try {
        let {urlCode} = req.params;

        // checking data on redis :- 
        let data = await client.get(urlCode);

        // if we find data on redis (cache hit) :- 
        if (data) {
            return res.status(200).send({ status: true, data: JSON.parse(data) });
        };

        // if data is not present on redis then we have to check it on db (cache miss) :- 
        const dataFromDb = await urlModel.findOne({urlCode: urlCode});

        // if data is not present on db :- 
        if (!dataFromDb) return res.status(404).send({status: false, message: 'No url found'});

        // storing data on redis retrived from db :-  
        await client.set(dataFromDb.urlCode, JSON.stringify(dataFromDb));
        
        // sending response to the client :- 
        res.status(200).send({status: true, data: dataFromDb});
    } catch (error) {
        res.status(500).send({ status: fasle, message: error.message });
    };
};

module.exports = {shortTheUrl, getTheMainUrl};