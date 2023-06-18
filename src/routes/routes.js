const express = require('express');
const router = express.Router();

const {shortTheUrl, getTheMainUrl} = require('../controller/controller');

router.post('/sort-the-url', shortTheUrl);
router.get('/get-the-main-url/:urlCode', getTheMainUrl);

module.exports = router;