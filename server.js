// Asenna ensin express npm install express --save

var express = require('express');
var app = express();

let cookieParser = require('cookie-parser');
app.use(cookieParser());

var bodyParser = require('body-parser');
var customerController = require('./customerController');

const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;

let users = {
    userName: "Testi",
    loginTime: Date.now(),
    sessionId: 1234
}


//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Staattiset filut
app.use(express.static('public'));

// REST API Asiakas
app.route('/Types')
    .get(customerController.fetchTypes);

/*app.route('/Asiakkaat')
    .get(customerController.fetchCustomers)*/

//tehtävä 45, Toteuta node.js:llä REST api, jonka avulla voidaan hakea 
//KAIKKI asiakkaat tietokannasta (Asiakas-taulusta).    
app.route('/Asiakas')
    .get(customerController.fetchAll)
    .post(customerController.create);

app.route('/Asiakas/:id')
    .put(customerController.update)
    .delete(customerController.delete);
//

app.get('/login', (req, res) => {
    res.cookie("userData", users);
    res.send("Käyttäjä lisätty");
});

app.get('/getuser', (req, res)=>{ 
    //shows all the cookies 
    res.send(req.cookies); 
    }); 

app.get('/', function (request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Terve maailma");
});

app.get('/maali', function (request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Maalit 2-3");
});

app.route('/task')
    .get(function (request, response) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end("Taskeja pukkaa");
    });

app.listen(port, hostname, () => {
    console.log(`Server running AT http://${hostname}:${port}/`);
});

/*
app.listen(port, () => {
    console.log(`Server running AT http://${port}/`);
  });
*/