var express = require("express");
var app = express();
var bing = require("./bing");
var mongo = require("mongodb").MongoClient;
var mongURL = 'mongodb://localhost:27017/searchHistory';
app.use(express.static('/public'));

app.get('/api/latest/imagesearch/', (req, res) => {
    mongo.connect(mongURL, (err, db) => {
        if (err) throw err;
        var collection = db.collection('searches');
        collection.find().toArray((err, s) => {
            if (err) throw err;
            res.send(s);
        });

        
    });
});

app.get('/api/imagesearch/:topic', (req, res) => {
    var topic = req.params.topic;
    var offset = req.query.offset;
    function responseSend(r) {
        var rJSON = JSON.parse(r);
        res.send(rJSON.value);
    }
    bing.imageSearch(topic, offset, responseSend);
    
    mongo.connect(mongURL, (err, db) => {
       if (err) throw err;
       var collection = db.collection('searches');
       collection.insert({topic: topic, date: new Date()});
       db.close();
    });
    
});


app.listen(process.env.PORT);