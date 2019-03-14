'use strict'

let log4js = require('log4js');
let logger = log4js.getLogger('api-transfer');
let eosClient = require('eosjs');
var rpc = require("../rpc.json");
var chain = require("../chain.json");

var create = function (req,res) {
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

    var  sender , value , syml, memo;
    if (req.body.sender){
		sender = req.body.sender;
	}else{
		res.status(500).json({error:'请输入初始化用户名...'});
		return;
    }

    if (req.body.value){
		value = req.body.value;
	}else{
		res.status(500).json({error:'请输入初始化数值...'});
		return;
    }

    if (req.body.syml){
		syml = req.body.syml;
	}else{
		res.status(500).json({error:'请输入代币代号...'});
		return;
    }

    if (req.body.memo){
		memo = req.body.memo;
	}else{
		memo = "create token";
    }
    value = value.toFixed(4) + " "+syml.toUpperCase();
    logger.info(value);
    eos.contract(sender).then((contract) => {
        logger.info("=======contract=====");
        // 合约 调用方法
        contract.create(
            sender,
            value,
          { authorization : [sender] }
        ).then((result) => {  
            logger.info(result);
            res.status(200).json({"info":JSON.stringify(result)});
            return;
        }).catch((err) => {  
            logger.error(err);
            res.status(500).json({"err":JSON.stringify(err)});
            return;
        });
    }).catch((err) => {  
        logger.error(err);
        res.status(500).json({"err":JSON.stringify(err)});
        return;
    });
};

var increase = function (req,res) {
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

    var  sender , value , syml, memo;
    if (req.body.sender){
		sender = req.body.sender;
	}else{
		res.status(500).json({error:'请输入增发用户名...'});
		return;
    }

    if (req.body.value){
		value = req.body.value;
	}else{
		res.status(500).json({error:'请输入增发的数值...'});
		return;
    }

    if (req.body.syml){
		syml = req.body.syml;
	}else{
		res.status(500).json({error:'请输入代币代号...'});
		return;
    }

    if (req.body.memo){
		memo = req.body.memo;
	}else{
		memo = "increase token";
    }
    value = value.toFixed(4) + " "+syml.toUpperCase();
    logger.info(value);
    eos.contract(sender).then((contract) => {
        logger.info("=======contract increase=====");
        // 合约 调用方法
        contract.increase(
            value,
            memo,
          { authorization : [sender] }
        ).then((result) => {  
            logger.info(result);
            res.status(200).json({"info":JSON.stringify(result)});
            return;
        }).catch((err) => {  
            logger.error(err);
            res.status(500).json({"err":JSON.stringify(err)});
            return;
        });
    }).catch((err) => {  
        logger.error(err);
        res.status(500).json({"err":JSON.stringify(err)});
        return;
    });
};

var issue = function (req,res) {
    var privateKey;
    if (req.body.privateKey){
		privateKey = req.body.privateKey;
	}else{
		res.status(500).json({error:'请输入私钥...'});
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

    var  sender , value , syml, memo;
    if (req.body.sender){
		sender = req.body.sender;
	}else{
		res.status(500).json({error:'请输入初始化用户名...'});
		return;
    }

    if (req.body.value){
		value = req.body.value;
	}else{
		res.status(500).json({error:'请输入初始化数值...'});
		return;
    }

    if (req.body.syml){
		syml = req.body.syml;
	}else{
		res.status(500).json({error:'请输入代币代号...'});
		return;
    }

    if (req.body.memo){
		memo = req.body.memo;
	}else{
		memo = "create token";
    }
    value = value.toFixed(4) + " "+syml.toUpperCase();
    logger.info(value);
    eos.contract(sender).then((contract) => {
        logger.info("=======contract issue=====");
        // 合约 调用方法
        contract.issue(
            sender,
            value,
            memo,
          { authorization : [sender] }
        ).then((result) => {  
            logger.info(result);
            res.status(200).json({"info":JSON.stringify(result)});
            return;
        }).catch((err) => {  
            logger.error(err);
            res.status(500).json({"err":JSON.stringify(err)});
            return;
        });
    }).catch((err) => {  
        logger.error(err);
        res.status(500).json({"err":JSON.stringify(err)});
        return;
    });
};

var transfer = function (req,res) {
    var privateKey;
    if (req.body.privateKey){
		privateKey = req.body.privateKey;
	}else{
		res.status(500).json({error:'请输入私钥...'});
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

    var  name,from ,to, value , syml, memo;

    if (req.body.name){
		name = req.body.name;
	}else{
		res.status(500).json({error:'请输入合约名...'});
		return;
    }

    if (req.body.from){
		from = req.body.from;
	}else{
		res.status(500).json({error:'请输入from用户名...'});
		return;
    }

    if (req.body.to){
		to = req.body.to;
	}else{
		res.status(500).json({error:'请输入to用户名...'});
		return;
    }

    if (req.body.value){
		value = req.body.value;
	}else{
		res.status(500).json({error:'请输入初始化数值...'});
		return;
    }

    if (req.body.syml){
		syml = req.body.syml;
	}else{
		res.status(500).json({error:'请输入代币代号...'});
		return;
    }

    if (req.body.memo){
		memo = req.body.memo;
	}else{
		memo = "transfer token";
    }

    value = value.toFixed(4) + " "+syml.toUpperCase();
    logger.info(value);
    eos.contract(name).then((contract) => {
        logger.info("=======contract issue=====");
        // 合约 调用方法
        contract.transfer(
            from,
            to,
            value,
            memo,
          { authorization : [from] }
        ).then((result) => {  
            logger.info(result);
            res.status(200).json({"info":JSON.stringify(result)});
            return;
        }).catch((err) => {  
            logger.error(err);
            res.status(500).json({"err":JSON.stringify(err)});
            return;
        });
    }).catch((err) => {  
        logger.error(err);
        res.status(500).json({"err":JSON.stringify(err)});
        return;
    });
};

var frozen = function (req,res) {
    var privateKey;
    if (req.body.privateKey){
		privateKey = req.body.privateKey;
	}else{
		res.status(500).json({error:'请输入私钥...'});
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

    var name, sender, value , syml, memo;
    if (req.body.sender){
		sender = req.body.sender;
	}else{
		res.status(500).json({error:'请输入初始化用户名...'});
		return;
    }

    if (req.body.name){
		name = req.body.name;
	}else{
		res.status(500).json({error:'请输入冻结用户名...'});
		return;
    }

    if (req.body.value){
		value = req.body.value;
	}else{
		res.status(500).json({error:'请输入初始化数值...'});
		return;
    }

    if (req.body.syml){
		syml = req.body.syml;
	}else{
		res.status(500).json({error:'请输入代币代号...'});
		return;
    }

    if (req.body.memo){
		memo = req.body.memo;
	}else{
		memo = "frozen token";
    }
    value = value.toFixed(4) + " "+syml.toUpperCase();
    logger.info(value);
    eos.contract(sender).then((contract) => {
        logger.info("=======contract issue=====");
        // 合约 调用方法
        contract.frozen(
            name,
            value,
            memo,
          { authorization : [sender] }
        ).then((result) => {  
            logger.info(result);
            res.status(200).json({"info":JSON.stringify(result)});
            return;
        }).catch((err) => {  
            logger.error(err);
            res.status(500).json({"err":JSON.stringify(err)});
            return;
        });
    }).catch((err) => {  
        logger.error(err);
        res.status(500).json({"err":JSON.stringify(err)});
        return;
    });
};

exports.create = create;
exports.issue = issue;
exports.transfer = transfer;
exports.increase = increase;
exports.frozen = frozen;
