var sha256 = require("js-sha256");
var secp256k1 = require("secp256k1");
class Transaction {
  //utxo -->
  constructor(input, prevOutput, signature) {
    //might need to pass an amount
    this.id = ""; //hash of body
    this.prevOutput = prevOutput;
    this.input = this.signPreviousOutput(); //signed previous output
    this.output = this.generateOutput();
    this.signature = signature;
    this.privKet;
  }

  hashTransactionBody = () => {
    //should be a blake3 hash
    //concatenate and hash together
    return sha256.hmac(sha256.hmac(this.input, this.outputs), this.signature); //this wont work
    //return sha256.hmac({...this.outputs, this.input}, this.signature)
  };

  signPreviousOutput = () => {
    //out input
    let privKey;
    do {
      this.privKet = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(this.privKey));
    {
      const signedPrevOutput = secp256k1.ecdsaSign(
        this.prevOutput,
        this.privKey
      );
    }
  };

  generateOutput = () => {
    const pubKey = secp256k1.publicKeyCreate(this.privKey);
    return [pubKey, amount];
  };
}

class Block {
  constructor(prevHash, transactionList) {
    this.prevHash = prevHash;
    this.transactionList = transactionList; //transaction list = [seedTransaction, ....]
    this.nonce = calculateNonce();
  }

  //SHA256 HASH OF PREVIOUS BLOCK
  //returns a hash
  calculateNonce = () => {
    return sha256.hmax(this.prevHash, this.transactionList);
  };

  //Mining
  //return a boolean

  validateBlock = () => {
    if (this.prevHash && this.transactionList && this.nonce) {
      //transaction list isValid() returns
      ///or transactionList.hasSeed() returns
      //check that transaction includes the seed isValid && hasSeed() returns true
    }
  };
}

class BlockChain {
  constructor() {
    this.chain = [];
  }

  createGenesisBlock = () => {
    return new Block(0, 0, "Genesis List");
  };

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
    //2 pointers
    for (let i = 0; i < this.chain.length; i++) {
      const currBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];
    }
  };
}

// let block = new Block("", "")
// let ourBlockchain = new Blockchain();
