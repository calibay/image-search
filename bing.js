
var https = require("https");
var fs = require("fs");


exports.imageSearch = function(topic, offset, callback) {
    topic = topic.replace(/ /g, '%20');

    fs.readFile('./bing.key', (err, data) => {
        if (err) throw err;
        var key = data.toString();
        var results ='';
        var params = {
            host: 'api.cognitive.microsoft.com',
            method: 'POST',
            port: '443',
            path: '/bing/v5.0/images/search?offset=' + offset + '&count=10&q=' + topic,
            headers: {
                "Content-Type": "multipart/form-data",
                "Ocp-Apim-Subscription-Key": key
            }
        };

        var req = https.request(params, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                //console.log('Response: ' + chunk);
                results += chunk;
            });
            res.on('end', () => {
               callback(results);
            });
        });
        
        req.end();
        req.on('error', (e) => {
           console.error(e); 
        });
        
    });

};