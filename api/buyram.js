'use strict'

let log4js = require('log4js');
let logger = log4js.getLogger('api-transfer');
let eosClient = require('eosjs');
var rpc = require("../rpc.json");
var chain = require("../chain.json");

var buyram = function (req, res) {

  var privateKey;
  var payAccount;
  var receiverAccount;
  var bytes;
  if (req.body.privateKey) {
    privateKey = req.body.privateKey;
  } else {
    res.status(500).json({ error: '请输入支付转账私钥...' });
    return;
  }
  if (req.body.payAccount) {
    payAccount = req.body.payAccount;
  } else {
    res.status(500).json({ error: '请输入支付转账...' });
    return;
  }
  if (req.body.receiverAccount) {
    receiverAccount = req.body.receiverAccount;
  } else {
    res.status(500).json({ error: '请输入接收转账...' });
    return;
  }
  if (req.body.bytes) {
    bytes = req.body.bytes;
  } else {
    res.status(500).json({ error: '请输入购买内存的字节...' });
    return;
  }


  var eos = eosClient({
    chainId: chain[0],
    keyProvider: [privateKey],
    httpEndpoint: rpc[0],
    expireInSeconds: 60,
    broadcast: true,
    verbose: false,
    sign: true
  });

  eos.transaction(tr => {
    tr.buyrambytes({
      payer: payAccount,
      receiver: receiverAccount,
      bytes: bytes
    })
  }).then((result) => {
    logger.info(result);
    res.status(200).json({ "result": JSON.stringify(result) });
  }).catch((err) => {
    logger.error(err);
    res.status(500).json({ error: JSON.stringify(err) });
  });
};


var sellram = function (req, res) {
  var privateKey, account, bytes;

  if (req.body.privateKey) {
    privateKey = req.body.privateKey;
  } else {
    res.status(500).json({ error: '请输入支付转账私钥...' });
    return;
  }

  if (req.body.account) {
    account = req.body.account;
  } else {
    res.status(500).json({ error: '请输入支付名称...' });
    return;
  }

  if (req.body.bytes) {
    bytes = req.body.bytes;
  } else {
    res.status(500).json({ error: '请输入购买内存的字节...' });
    return;
  }

  var eos = eosClient({
    chainId: chain[0],
    keyProvider: [privateKey],
    httpEndpoint: rpc[0],
    expireInSeconds: 60,
    broadcast: true,
    verbose: false,
    sign: true
  });


  eos.transaction(tr => {
    tr.sellram({
      account: account,
      bytes: bytes
    })
  }).then((result) => {
    logger.info(result);
    res.status(200).json({ "result": JSON.stringify(result) });
  }).catch((err) => {
    logger.error(err);
    res.status(500).json({ error: JSON.stringify(err) });
  });
};

exports.sellram = sellram;
exports.buyram = buyram;