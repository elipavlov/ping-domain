var express = require('express');
var spawn = require('child_process').spawn;
var encoding = require("encoding");
var url = require('url');
var router = express.Router();

/* GET home page. */

router.isWin = 'win32' == process.platform || 'win64' == process.platform;

router.get('/', function (req, res, next) {
    var qurl = url.parse(req.url, true);

    if (qurl.query != undefined && qurl.query.url != undefined) {
        if (qurl.query.url.trim().length > 0) {
            if (router.isWin) {
                var child = spawn('ping', [qurl.query.url, '-n', '1']);
            } else {
                var child = spawn('ping', [qurl.query.url, '-c', '1']);
            }
            var result = '';

            res.writeHead(200, {'Content-Type': 'application/json'});
            child.stdout.on('data', function (chunk) {
                var buf = chunk;
                if (router.isWin)
                    buf = encoding.convert(buf, 'OEM', 'utf-8');

                result += buf.toString();
            });
            child.stderr.on('data', function (chunk) {
                var buf = chunk;
                if (router.isWin)
                    buf = encoding.convert(buf, 'OEM', 'utf-8');
                result += buf.toString();
            });

            child.stdout.on('end', function () {
                var json = JSON.stringify({
                    response: result
                });
                res.end(json);
            });
            child.stdout.on('error', function (err) {
                console.log(err);
                var json = JSON.stringify({
                    response: err.toString()
                });
                res.end(json);
            });
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            var json = JSON.stringify({
                response: "empty request"
            });
            res.end(json);
        }

    } else {
        res.render('index', {title: 'ping domain'});
    }
});

module.exports = router;
