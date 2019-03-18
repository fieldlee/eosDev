'use strict'

let log4js = require('log4js');
let logger = log4js.getLogger('api-transfer');
let eosClient = require('eosjs');
var rpc = require("../rpc.json");
var chain = require("../chain.json");

var transfer = function (req,res) {
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

    var from , to ,value , memo;
    if (req.body.from){
		  from = req.body.from;
	  }else{
      res.status(500).json({error:'请输入转账用户名...'});
      return;
    }
    if (req.body.to){
		to = req.body.to;
	}else{
      res.status(500).json({error:'请输入转账用户名...'});
      return;
    }
    if (req.body.value){
		  value = req.body.value;
	  }else{
		  res.status(500).json({error:'请输入转账数值...'});
		  return;
    }

    if (req.body.memo){
		  memo = req.body.memo;
	  }else{
		  memo = "pay token";
    }

    value = value.toFixed(4) + " SYS";

    eos.transfer(from, to, value, memo, (err, result)=>{
        if(err){
            logger.error("error:",error);
            res.status(500).json({error:JSON.stringify(err)});
        }else{
            logger.info("result:",result);
            res.status(200).json({"result":JSON.stringify(result)});
        }
    });
};

exports.transfer = transfer;