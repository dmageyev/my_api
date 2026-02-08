const http = require('http');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data');

const server = http.createServer((req, res) => {
    if (req.url == '/jokes' && req.method == 'GET') {
        getAllJokess(req, res);
    }
   // if (req.url == '/jokes' && req.method == 'POST') {
   //     addJoke(req, res);
   // }
});
server.listen(3000);

function getAllJokess(req, res) {
    let dir = fs.readdirSync(dataPath);
    let jokes = [];
    for (let i=0; i<dir.length; i++) {
        let file = fs.readFileSync(path.join(dataPath, i+'+.json'));
        let jokeJson = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJson);
        joke.id = i;
        jokes.push(joke);
    }
    
    res.end(JSON.stringify(getAllJokess));
}