const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello World!')
});
app.get('/data', (req, res)=>{
    res.sendFile(__dirname + '/galilean.xlsx');
});

const getFileUpdatedDate = (path) => {
    const stats = fs.statSync(path);
    return {time: stats.mtime.getTime(), date: stats.mtime}
};
app.get('/date', (req, res) => {
    res.status(200).type('json').send(getFileUpdatedDate('./galilean.xlsx'));
});

app.use(express.static('./'));

app.listen(port, () => {
    console.log(`Galilean app listening at http://localhost:${port}/galilean.html`)
})