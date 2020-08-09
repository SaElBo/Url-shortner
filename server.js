const express = require('express');
const mongoose = require('mongoose');

const ShortUrl = require('./mongoSchema');

mongoose.connect('mongodb://localhost:27017/urlShortner', {
    useNewUrlParser: true, useUnifiedTopology: true
})

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))


app.route('/')
    .get((req, res) => {
        res.render('index.html')
    })
    .post(async (req, res) => {
        try {
            const url = new ShortUrl({
                full: req.body.URL
            });
            await url.save();
        }
        catch (err) {
            console.error(err)
        }


        res.redirect('/short')
    })


app.route('/short')
    .get(async (req, res) => {
        const allUrl = await ShortUrl.find({});
        res.send('localhost:3000/' + allUrl[allUrl.length -1 ].short)
    })

app.route('/:shortID')
    .get(async (req, res) => {
        const shortId = req.params.shortID

        const url = await ShortUrl.findOne({ short: shortId })
        console.log(url.ful)
        res.redirect(url.full)
    })
app.listen(3000, () => {
    console.log('server partito')
})