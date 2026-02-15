const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const dataPath = path.join(__dirname, 'data');

const server = http.createServer((req, res) => {
    if (req.url == '/jokes' && req.method == 'GET') {
        getAllJokess(req, res);
    }
    if (req.url == '/jokes' && req.method == 'POST') {
        addJoke(req, res);
    }
    if (req.url.startsWith('/like')) {
        like(req, res);
    }
    if (req.url.startsWith('/dislike')) {
        dislike(req, res);
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

function like(req, res) {
    const params = url.parse(req.url, true).query;
    let id = params.id;
    if (id) {
        let filePath = path.join(dataPath, id+'.json');
        let file = fs.readFileSync(filePath);
        let jokeJson = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJson);
        joke.likes++;
        fs.writeFileSync(filePath, JSON.stringify(joke));

    }
    res.end();
}

function dislike(req, res) {
    const params = url.parse(req.url, true).query;
    let id = params.id;
    if (id) {
        let filePath = path.join(dataPath, id+'.json');
        let file = fs.readFileSync(filePath);
        let jokeJson = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJson);
        joke.dislikes++;
        fs.writeFileSync(filePath, JSON.stringify(joke));

    }
    res.end();
}