const mongoose = require('mongoose')

const tokenAwardSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    required: true,
  },
  tokenId: {
    type: Number,
    required: true,
  },
  tokenName: {
    type: String,
    required: true,
  },
  tokenAmount: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model('tokenAward', tokenAwardSchema)
