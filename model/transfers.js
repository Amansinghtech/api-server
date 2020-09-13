const mongoose = require('mongoose')
const transferSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  operator: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  tokenId: {
    type: Number,
    required: true,
  },
  tokenAmount: {
    type: Number,
    required: true,
  },
})
module.exports = mongoose.model('transfers', transferSchema)
