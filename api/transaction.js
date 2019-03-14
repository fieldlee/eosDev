'use strict'

let util = require('util');
let fs = require('fs');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/eosmain', {useNewUrlParser: true});

var transactionSchema = mongoose.Schema({
    trx_id: String
});

var Schema = mongoose.model('transactions',transactionSchema);
  var transaction = function (req, res) {
    var id = "";

    if (req.body.id) {
      id = req.body.id;
    } else {
      res.status(500).json({ error: '请输入transaction_id...' });
      return;
    }
    Schema.findOne({"trx_id":id},function(err,docs){
        if (err){
            res.status(500).json({ error: err });
        }
        res.status(200).json({ "transaction":docs });
    });
  };
  
  exports.transaction = transaction;

  
  