const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shprtid = require('shortid');
const config = require('config');

const Url = require('../models/Url');
const shortid = require('shortid');

// Route POST /api/url/shorten

// Description  - > Create short URL

router.post('/shorten', async (req, res) => {
    const {longUrl } = req.body;
    const baseUrl = config.get('baseUrl');

    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json('Invalid base URL');

    }

    // CREATING URL CODE

    const urlCode = shortid.generate();

    // CHECKING LONG URL

    if(validUrl.isUri(longUrl)){
        try {
            let url = await Url.findOne({ longUrl});

            if(url) {
                res.json(url);

            }else {
                const shortUrl = baseUrl + '/' + urlCode;

                url = new Url ({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()

                });

                await url.save();

                res.json(url);

            }

        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
            
        }
    
    }else{
        res.status(401).json('Invalid long Url');
    }

});

module.exports = router;