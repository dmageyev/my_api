const http = require('http');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data');

const server = http.createServer((req, res) => {
    if (req.url == '/jokes' && req.method == 'GET') {
        getAllJokess(req, res);
    }
    if (req.url == '/jokes' && req.method == 'POST') {
        addJoke(req, res);
    }
});
server.listen(3000);

function getAllJokess(req, res) {
    let dir = fs.readdirSync(dataPath);
    let jokes = [];
    for (let i=0; i<dir.length; i++) {
        let file = fs.readFileSync(path.join(dataPath, i+'.json'));
        let jokeJson = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJson);
        joke.id = i;
        jokes.push(joke);
    }
    res.writeHead(200, {'Content-Type': 'application/json' });
    res.end(JSON.stringify(jokes) );
}

function addJoke(req, res) {
    let body = '';
    req.on('data', function(chunk) {
        body += chunk;        
    });
    req.on('end', function () {
        let joke = JSON.parse(body);
        joke.likes = 0;
        joke.dislikes = 0;
        let dir = fs.readdirSync(dataPath);
        let fileName = dir.length + '.json';
        let filePath = path.join(dataPath, fileName);
        fs.writeFileSync(filePath,  JSON.stringify(joke));
        res.writeHead(200, {'Content-Type': 'application/json' });
        res.end();
    });
}