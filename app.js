// log4js
let log4js = require('log4js');
let logger = log4js.getLogger('eosSDK');

// express
let express = require('express');
let bodyParser = require('body-parser');
let http = require('http');
let cors = require('cors');
let app = express();

// eos modules
let eosCreateAccount = require('./api/account');
let ram = require('./api/buyram');
let delegate = require('./api/delegate');
let transfer = require('./api/transfer');

let host = process.env.HOST || "127.0.0.1";
let port = process.env.PORT || "4000";

app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: false
}));
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function () { });

logger.info('****************** SERVER STARTED ************************');
logger.info('**************  http://' + host + ':' + port + '  ******************');
server.timeout = 240000;

app.post('/eoscreateaccount', async function (req, res) {
    await eosCreateAccount.createEosAccount(req, res);
});

app.post('/eosgetaccount', async function (req, res) {
    await eosCreateAccount.getAccount(req, res);
});

app.post('/buyram', async function (req, res) {
    ram.buyram(req,res);
});

app.post('/sellram', async function (req, res) {
    ram.sellram(req,res);
});

app.post('/transfer', async function (req, res) {
    transfer.transfer(req,res);
});

app.post('/getbalance', async function (req, res) {
    eosCreateAccount.getBalance(req,res);
});

app.post('/delegate', async function (req, res) {
    delegate.delegatebw(req,res);
});

app.post('/getaccountbykey', async function (req, res) {
    eosCreateAccount.getAccountByPrivateKey(req,res);
});

app.post('/undelegate', async function (req, res) {
    delegate.undelegatebw(req,res);
});