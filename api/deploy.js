'use strict'

var util = require('util');
var fs = require('fs');
let log4js = require('log4js');
let logger = log4js.getLogger('api-transfer');
let eosClient = require('eosjs');
var rpc = require("../rpc.json");
var chain = require("../chain.json");

var deploy = function (eos, logger) {

    var privateKey;
    if (req.body.privateKey){
		  privateKey = req.body.privateKey; 
	  }else{
      res.status(500).json({error:'请输入转账私钥...'});
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

    var account;
    if (req.body.account){
        account = req.body.account;
	}else{
        res.status(500).json({error:'请输入账号...'});
        return;
    }
    
    wasm = fs.readFileSync('docker/contracts/eosio.token/eosio.token.wasm');
    abi = fs.readFileSync('docker/contracts/eosio.token/eosio.token.abi');

    // Publish contract to the blockchain
    eos.setcode(account, 0, 0, wasm).then((result) => {
        logger.info(result); 
        eos.setabi(account, JSON.parse(abi)).then((result) => {
            logger.info(result);
            res.status(200).json(result);
        }).catch((err) => {
            logger.error(err);
            res.status(500).json({error:JSON.stringify(err)});
            return;
        }); // @returns {Promise}  
    }).catch((err) => {
        logger.error(err);
        res.status(500).json({error:JSON.stringify(err)});
        return;
    }); // @returns {Promise}
};

modules.deploy = deploy;