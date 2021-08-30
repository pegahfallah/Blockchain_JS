var sha256 = require("js-sha256");
var secp256k1 = require("secp256k1");
const { randomBytes } = require("crypto");
// generate message to sign
// message should have 32-byte length, if you have some other length you can hash message
// for example `msg = sha256(rawMessage)`
// const msg = randomBytes(32)
// // verify the signature
// console.log(secp256k1.ecdsaVerify(sigObj.signature, msg, pubKey))
// => true
class Transaction {
  //utxo -->
  constructor(prevOutput, publicKey) {
    // val: get the amount from the previous output
    this.publicKey = publicKey;
    this.prevOutput = prevOutput;
    this.privKey;
    // header of transaction
    this.id = this.hashTranscationBody();
    // body of transaction
    this.input = prevOutput;
    this.outputs = this.generateOutput();
    this.signature = this.signPrevOutput();
  }

  hashTransactionBody = () => {
    //should be a blake3 hash
    //concatenate and hash together
    return sha256.hmac(sha256.hmac(this.input, this.outputs), this.signature); //this wont work
    //return sha256.hmac({...this.outputs, this.input}, this.signature)
  };
  signPrevOutput = () => {
    // generate privKey
    // let privKey
    do {
      this.privKey = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(this.privKey));
    // sign the previous output
    return secp256k1.ecdsaSign(this.prevOutput, this.privKey);
  };

  generateOutput = () => {
    // get the public key in a compressed format
    // const pubKey = secp256k1.publicKeyCreate(this.privKey)
    return [this.publicKey, this.prevOutput.amount];
  };

  // Note: Remember the seed transaction!

  isTransactionValid = () => {
    // check The transaction id is a valid hash over the transaction body
    // The public key associated to the unspent transaction output is derived from a Secp256k1 private key
    // The public key associated to the unspent transaction output used as the input, successfully validates the signature
    //  The value of ARB associated with the input is greater than or equal to the sum of the values associated with the outputs
  };

  hasSeedTransaction = () => {
    // check that transaction includes seed
  };
}

class Block {
  constructor(index, prevHash, transactionList) {
    this.index = index;
    this.prevHash = prevHash;
    this.transactionList = transactionList; // transactionList = [seedTrasaction, ....]
    this.nonce = this.calculateNonce();
  }

  calculateNonce = () => {
    // returns a hash
    return sha256.hmac(this.prevHash, this.transactionList);
  };

  // Mining
  validateBlock = () => {
    // returns a boolean
    if (this.prevHash && this.transactionList && this.nonce) {
      // so transaction.isTransactionValid() && transaction.hasSeedTrasanction() ? return true: else false
    }
  };
}

class BlockChain {
  constructor() {
    this.chain = [];
  }

  // createGenesisBlock = () => {
  //   return new Block(0, 0, "Genesis List");
  // };

  getRecentBlock = () => {
    return this.chain[this.chain.length - 1];
  };

  addBlock = (newBlock) => {
    newBlock.prevHash = this.getRecentBlock().nonce;
    //nonce of the hash of the most recent before this one

    newBlock.nonce = newBlock.calculateNonce();

    if (newBlock.validateBlock() && this.chain.isChainValid()) {
      //append the new Block
      this.chain.push(newBlock);
    }
  };

  isChainValid = () => {
    for (let i = 0; i < this.chain.length; i++) {
      const currBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currBlock.nonce != currBlock.calculateNonce()) {
        return false;
      }

      if (currBlock.prevHash != prevBlock.nonce) {
        return false;
      }

      return true;
    }
  };
}

// let block = new Block("", "")
// let ourBlockchain = new Blockchain();

// let senderPrivKey =
// let senderPublicKey =
// let transaction0 = ([senderPublicKey, 10])
// let block0 = new Block(0, 0, transaction0 )
// let ourBlockchain = new BlockChain();
// ourBlockchain.addBlock(block0)
// let block1 = new Block(1, block0.nonce, newTransaction)
