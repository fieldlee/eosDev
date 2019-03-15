const hdkey = require('hdkey')
const wif = require('wif')
const ecc = require('eosjs-ecc')
const bip39 = require('bip39')


var mnemonic = function (req,res) {
    var mnemonic;
    if (req.body.mnemonic){
		mnemonic = req.body.mnemonic;
	}else{
		res.status(500).json({error:'请输入助记词...'});
		return;
    }

    // const mnemonic = 'real flame win provide layer trigger soda erode upset rate beef wrist fame design merit'
    const seed = bip39.mnemonicToSeedHex(mnemonic)
    const master = hdkey.fromMasterSeed(Buffer(seed, 'hex'))
    const node1 = master.derive("m/44'/194'/0'/0/0")
    const node2 = master.derive("m/44'/194'/0'/0/1")
    console.log("publicKey: "+ecc.PublicKey(node1._publicKey).toString())
    console.log("privateKey: "+wif.encode(128, node1._privateKey, false))
   
    let json = {
        "owner_pub":ecc.PublicKey(node1._publicKey).toString(),
        "owner_pri":wif.encode(128, node1._privateKey, false),
        "active_pub":ecc.PublicKey(node2._publicKey).toString(),
        "active_pri":wif.encode(128, node2._privateKey, false)
    }
    res.status(200).json(json);
};

exports.mnemonic = mnemonic;