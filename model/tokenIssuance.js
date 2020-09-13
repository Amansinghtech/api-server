const mongoose = require('mongoose')

const issuanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  publisher: {
    type: String,
    required: true,
  },
  newToken: {
    type: Boolean,
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

module.exports = mongoose.model('tokenIssuance', issuanceSchema)
