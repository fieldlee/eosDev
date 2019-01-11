'use strict'

let log4js = require('log4js');
let logger = log4js.getLogger('api-delegate');
let eosClient = require('eosjs');
var rpc = require("../rpc.json");
var chain = require("../chain.json");



var delegatebw = function (req, res) {

  var stakeNET = 0.0;
  var stakeCPU = 0.0;


  var privateKey, payAccount, receiverAccount;
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
  if (req.body.net) {
    stakeNET = req.body.net;
  }

  if (req.body.cpu) {
    stakeCPU = req.body.cpu;
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
      tr.delegatebw({
          from: payAccount,
          receiver: receiverAccount,
          stake_net_quantity: stakeNET.toFixed(4) + ' SYS',
          stake_cpu_quantity: stakeCPU.toFixed(4) + ' SYS',
          transfer: 0
      })
  }).then((result) => {
      logger.info(result);
      res.status(200).json({ "result": JSON.stringify(result) });
  }).catch((err) => {
      logger.error(err);
      res.status(500).json({ error: JSON.stringify(err) });
  });
};

var undelegatebw = function (req, res) {
  var unstakeNET = 0.0;
  var unstakeCPU = 0.0;
  var privateKey, payAccount, receiverAccount;

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

  if (req.body.net) {
    unstakeNET = req.body.net;
  }

  if (req.body.cpu) {
    unstakeCPU = req.body.cpu;
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
      tr.undelegatebw({
          from: payAccount,
          receiver: receiverAccount,
          unstake_net_quantity: unstakeNET.toFixed(4) + ' SYS',
          unstake_cpu_quantity: unstakeCPU.toFixed(4) + ' SYS'
      });
      logger.info(payAccount);
      logger.info(receiverAccount);
      logger.info(unstakeNET.toFixed(4) + ' SYS');
      logger.info(unstakeCPU.toFixed(4) + ' SYS');
  }).then((result) => {
      logger.info(result);
      res.status(200).json({"result": JSON.stringify(result)});
  }).catch((err) => {
      logger.error(err);
      res.status(500).json({ error: JSON.stringify(err)});
  });
};

exports.delegatebw = delegatebw;
exports.undelegatebw = undelegatebw;

