'use strict'

let util = require('util');
let fs = require('fs');
let mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/eosmain', {useNewUrlParser: true});
let log4js = require('log4js');
let logger = log4js.getLogger('api-account');
let eosClient = require('eosjs');
var keys = require("../keys.json");
var rpc = require("../rpc.json");
var chain = require("../chain.json");

var transactionSchema = mongoose.Schema({
    trx_id: String
});

// var Schema = mongoose.model('transactions',transactionSchema);
  var transaction = function (req, res) {
    var id = "";

    if (req.body.id) {
      id = req.body.id;
    } else {
      res.status(500).json({ error: '请输入transaction_id...' });
      return;
    }
    // Schema.findOne({"trx_id":id},function(err,docs){
    //     if (err){
    //         res.status(500).json({ error: err });
    //     }
    //     res.status(200).json({ "transaction":docs });
    // });
    var eos = eosClient({
      chainId: chain[0],
      // keyProvider: keys,
      httpEndpoint: rpc[0],
      expireInSeconds: 60,
      broadcast: true,
      verbose: false,
      sign: true
  });

    // var tx_id = "A6C704FAF53146B07DF4384B86FCCC4F758791C09E2A7FFFD52095C03C1FBA51";
    eos.getTransaction(id,0).then((result) => {
        logger.info(JSON.stringify(result));    
        res.status(200).json({"info":JSON.stringify(result)});
    }).catch((err) => {
        logger.error(err);
        res.status(500).json({"err":JSON.stringify(err)});
    });
  };
  


  exports.transaction = transaction;

  
  