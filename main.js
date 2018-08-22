const SHA256 = require("crypto-js/sha256");

// main block class
class Block {
    constructor(timestamp, data, previousHash = '') {
            this.timestamp = timestamp;
            this.data = data;
            this.previousHash = previousHash;
            this.hash = this.calculateHash();
            // proof of work for mining
            this.nonce = 0;
        }
        // calculate hash for each block
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // implemet mining
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            // calculate hash of new block
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }
}



// blockchain class includes array of blocks
class Blockchain {
    constructor() {
            this.chain = [this.createGenesisBlock()];
            //increase difficulty number for slower mining
            this.difficulty = 5;
        }
        // genesis block without previous hash
    createGenesisBlock() {
        return new Block("09/08/2017", "Genesis Block", "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
            // get previous block hash
            newBlock.previousHash = this.getLatestBlock().hash;
            // mines block according to difficulty
            newBlock.mineBlock(this.difficulty);
            // add to chain
            this.chain.push(newBlock);
        }
        // iterate to see if the hash remains untampered with
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }


}


// TESTING THE BLOCKCHAIN


// create blockchain
let charlyCoin = new Blockchain();


// create 2 blocks
console.log('Mining block 1...');
charlyCoin.addBlock(new Block("20/07/2017", {
    amount: 4
}));
console.log('Mining block 2...');
charlyCoin.addBlock(new Block("22/07/2017", {
    amount: 10
}));

// uncomment 2 lines below to tamper with the chain, it will return false
//charlyCoin.chain[1].data = { amount: 100 };
//charlyCoin.chain[1].hash = charlyCoin.chain[1].calculateHash();

console.log(JSON.stringify(charlyCoin, null, 4));
console.log('Blockchain valid? ' + charlyCoin.isChainValid());