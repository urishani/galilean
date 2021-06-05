const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 8080;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Hello World!')
});
app.get('/data', (req, res)=>{
    res.sendFile(__dirname + '/data/galilean.xlsx');
});
app.get('/main', (req, res) => load(res, '/galilean.html', 0));
app.get('/room', (req, res) => {
    let n = Number(req.query.n);
    if (!n || n <= 0) {
        res.status(404).send('Room number [' + req.params.n + '] is illegal');
        return;
    }
    load(res, '/galilean.html', n)
});

const load = (res, fn, n) => {
    fs.readFile(__dirname + '/public' + fn, (err, data) => {
        if (err || !data) {
            res.send(500, 'error reading file [/galilean.html]: ' + err);
            return;
        }
        data = data.toString();
        res.set('Content-Type', 'text/html');
        data = data.replace('$room-number$', n);
        res.send(data);
    })
};

const getFileUpdatedDate = (path) => {
    const stats = fs.statSync(path);
    return {time: stats.mtime.getTime(), date: stats.mtime}
};
app.get('/date', (req, res) => {
    res.status(200).type('json').send(getFileUpdatedDate(__dirname + '/data/galilean.xlsx'));
});

app.use(express.static('./'));

app.listen(port, () => {
    console.log(`Galilean app listening at http://localhost:${port}/galilean.html`)
})