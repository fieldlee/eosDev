'use strict'

let util = require('util');
let fs = require('fs');
let {PrivateKey, PublicKey, Signature, Aes, key_utils, config} = require('eosjs-ecc')
// log4js
let log4js = require('log4js');
let logger = log4js.getLogger('api-account');
let eosClient = require('eosjs');
var keys = require("../keys.json");
var rpc = require("../rpc.json");
var chain = require("../chain.json");

var createEosAccount = async function(req,res){
    var creator;
    var name;
    var privateKey;
    if (req.body.privateKey) {
        privateKey = req.body.privateKey;
    } else {
        res.status(500).json({ error: '请输入私钥...' });
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

    if (req.body.creator){
		creator = req.body.creator;
	}else{
		res.status(500).json({error:'请输入创建账号...'});
		return;
    }
    if (req.body.name){
		name = req.body.name;
	}else{
		res.status(500).json({error:'请输入创建账号名称...'});
		return;
	}

    // owner 公钥
    var ownerPrivateKey,ownerPublicKey,activePrivateKey,activePublicKey;
    ownerPrivateKey = await PrivateKey.randomKey();
    ownerPrivateKey = ownerPrivateKey.toWif();
    ownerPublicKey = PrivateKey.fromString(ownerPrivateKey).toPublic().toString();

    logger.info("ownerPrivateKey:",ownerPrivateKey);
    logger.info("ownerPublicKey:",ownerPublicKey);

    activePrivateKey = await PrivateKey.randomKey();
    activePrivateKey = activePrivateKey.toWif();
    activePublicKey = PrivateKey.fromString(activePrivateKey).toPublic().toString();

    logger.info("activePrivateKey:",activePrivateKey);
    logger.info("activePublicKey:",activePublicKey);

    var bytes = 10 * 1024;
    var stakeNET = 1.00;
    var stakeCPU = 1.00;
    
    try {
        let result = await createaccount(eos,creator, name, ownerPublicKey,activePublicKey,bytes,stakeNET,stakeCPU);
        res.status(200).json({
            "result":result,
            "ownerPrivateKey":ownerPrivateKey,
            "ownerPublicKey":ownerPublicKey,
            "activePrivateKey":activePrivateKey,
            "activePublicKey":activePublicKey
        });
    } catch (error) {
        res.status(500).json({
            "error":error
        });
    }
};

function createaccount (eos,creator, name, ownerPublicKey,activePublicKey,bytes,stakeNET,stakeCPU) {
    return new Promise (async function (resolve, reject) {
        eos.transaction (tr => {
            logger.info("creator:",creator);
            logger.info("name:",name);
            tr.newaccount ({
                creator: creator,
                name: name,
                owner: ownerPublicKey,
                active: activePublicKey
            });
            tr.buyrambytes ({
                payer: creator,
                receiver: name,
                bytes: bytes
            });
            tr.delegatebw ({
                from: creator,
                receiver: name,
                stake_net_quantity: stakeNET.toFixed(4) + ' SYS',
                stake_cpu_quantity: stakeCPU.toFixed(4) + ' SYS',
                transfer: 0
            });
          })
          .then (data => {
            logger.info("data:",data);
            resolve (data.transaction_id);
          })
          .catch (error => {
            logger.error("error:",error);
            reject (error);
          });
      });
  }


var createEosAccountByKey = async function(req,res){
    var creator;
    var name;
    var privateKey;
    if (req.body.privateKey) {
        privateKey = req.body.privateKey;
    } else {
        res.status(500).json({ error: '请输入私钥...' });
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

    if (req.body.creator){
		creator = req.body.creator;
	}else{
		res.status(500).json({error:'请输入创建账号...'});
		return;
    }
    if (req.body.name){
		name = req.body.name;
	}else{
		res.status(500).json({error:'请输入创建账号名称...'});
		return;
	}

    // owner 公钥
    var ownerPrivateKey,ownerPublicKey,activePrivateKey,activePublicKey;

    if (req.body.ownerPrivateKey){
        ownerPrivateKey = req.body.ownerPrivateKey;
        ownerPublicKey = PrivateKey.fromString(ownerPrivateKey).toPublic().toString();
	}else{
		res.status(500).json({error:'请输入创建账号ownerprivatekey...'});
		return;
	}

    

    logger.info("ownerPrivateKey:",ownerPrivateKey);
    logger.info("ownerPublicKey:",ownerPublicKey);


    if (req.body.activePrivateKey){
        activePrivateKey = req.body.activePrivateKey;
        activePublicKey = PrivateKey.fromString(activePrivateKey).toPublic().toString();
	}else{
		res.status(500).json({error:'请输入创建账号activePrivateKey...'});
		return;
	}

    logger.info("activePrivateKey:",activePrivateKey);
    logger.info("activePublicKey:",activePublicKey);

    var bytes = 10 * 1024;
    var stakeNET = 1.00;
    var stakeCPU = 1.00;
    
    try {
        let result = await createaccount(eos,creator, name, ownerPublicKey,activePublicKey,bytes,stakeNET,stakeCPU);
        res.status(200).json({
            "result":result,
            "ownerPrivateKey":ownerPrivateKey,
            "ownerPublicKey":ownerPublicKey,
            "activePrivateKey":activePrivateKey,
            "activePublicKey":activePublicKey
        });
    } catch (error) {
        res.status(500).json({
            "error":error
        });
    }
};

var getAccount = async function(req,res){
    var eos = eosClient({
        chainId: chain[0],
        // keyProvider: keys,
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
		res.status(500).json({error:'请输入创建账号名称...'});
		return;
	}

    try {
        let result = await eos.getAccount(account);
        logger.info(JSON.stringify(result));
        res.status(200).json({
            "result":JSON.stringify(result)
        });
    } catch (error) {
        res.status(500).json({
            "error":JSON.stringify(error)
        });
    }
    return
}

var getBalance = function(req,res){
    var eos = eosClient({
        chainId: chain[0],
        // keyProvider: keys,
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
		res.status(500).json({error:'请输入创建账号名称...'});
		return;
	}
    eos.getCurrencyBalance({
        code: 'eosio.token',
        account: account,
        symbol: 'SYS'
    }).then((result) => {
        logger.info(util.format('====getCurrencyBalance:"%s"', JSON.stringify(result)));
        res.status(200).json({
            "result":JSON.stringify(result)
        });
    }).catch((err) => {
        logger.error(util.format('====getCurrencyBalance Error:"%s"', err));
        res.status(500).json({
            "err":JSON.stringify(err)
        });
    });
}

var getAccountByPrivateKey = function (req,res) {
    var privateKey;
    if (req.body.privateKey) {
        privateKey = req.body.privateKey;
    } else {
        res.status(500).json({ error: '请输入私钥...' });
        return;
    }
    
    var eos = eosClient({
        chainId: chain[0],
        // keyProvider: keys,
        httpEndpoint: rpc[0],
        expireInSeconds: 60,
        broadcast: true,
        verbose: false,
        sign: true
    });
    
    var publicKey = PrivateKey.fromString(privateKey).toPublic().toString();

    eos.getKeyAccounts(publicKey).then(function (value) {
        logger.info(value);
        res.status(200).json({
            "result":JSON.stringify(value)
        });
    }).catch(function (err) {
        logger.error(err);
        res.status(500).json({
            "err":JSON.stringify(err)
        });
    });
}

exports.getAccountByPrivateKey = getAccountByPrivateKey;
exports.getBalance = getBalance;
exports.getAccount = getAccount;
exports.createEosAccount = createEosAccount;
exports.createEosAccountByKey = createEosAccountByKey