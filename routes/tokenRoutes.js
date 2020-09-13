const express = require('express')
const router = express.Router()
var ethers = require('ethers')
const Web3 = require('web3')
const datalake = require('../datalake3')
let web3 = new Web3(Web3.givenProvider || 'http://35.225.200.185:8545')
let contractIns = new web3.eth.Contract(datalake.abi, datalake.contract)

//importing all schemas
const transfers = require('../model/transfers')
const tokenAward = require('../model/tokenAward')
const tokenIssuance = require('../model/tokenIssuance')
// let provider = ethers.providers.getDefaultProvider('mainnet');
const provider = new ethers.providers.JsonRpcProvider(
  'http://35.225.200.185:8545',
)
var ContractAddress = datalake.contract

const PurchaedJsonInterface = web3.utils._.find(
  contractIns._jsonInterface,
  (o) => o.name === 'Purchased' && o.type === 'event',
)
const TokenIssuanceJsonInterface = web3.utils._.find(
  contractIns._jsonInterface,
  (o) => o.name === 'TokenIssuance' && o.type === 'event',
)
const TokenAwardJsonInterface = web3.utils._.find(
  contractIns._jsonInterface,
  (o) => o.name === 'TokenAward' && o.type === 'event',
)
const TransferSingleJsonInterface = web3.utils._.find(
  contractIns._jsonInterface,
  (o) => o.name === 'TransferSingle' && o.type === 'event',
)
let topic1 = PurchaedJsonInterface.signature
let topic2 = TokenIssuanceJsonInterface.signature
let topic3 = TokenAwardJsonInterface.signature
let topic4 = TransferSingleJsonInterface.signature

let filter1 = {
  address: ContractAddress,
  topics: [topic1],
}
let filter2 = {
  address: ContractAddress,
  topics: [topic2],
}
let filter3 = {
  address: ContractAddress,
  topics: [topic3],
}
let filter4 = {
  address: ContractAddress,
  topics: [topic4],
}

provider.on(filter1, (result) => {
  const eventObj = web3.eth.abi.decodeLog(
    PurchaedJsonInterface.inputs,
    result.data,
    result.topics.slice(1),
  )
  console.log('Filter 1 data: ') //to remove later
  console.log(eventObj)
  //here you get the event data. based on the data model you get push the data
  // to mongodb.
  // ****** Your Mongodb Create operation Goes Here***********
})

provider.on(filter2, (result) => {
  const eventObj = web3.eth.abi.decodeLog(
    TokenIssuanceJsonInterface.inputs,
    result.data,
    result.topics.slice(1),
  )
  const data = new tokenIssuance({
    publisher: eventObj.publisher,
    newToken: eventObj.newToken,
    tokenId: parseInt(eventObj.tokenId),
    tokenName: eventObj.tokenName,
    tokenAmount: parseInt(eventObj.tokenAmount),
  })
  data.save()
  // console.log(data)
})
provider.on(filter3, (result) => {
  const eventObj = web3.eth.abi.decodeLog(
    TokenAwardJsonInterface.inputs,
    result.data,
    result.topics.slice(1),
  )
  console.log(eventObj)
  const award = new tokenAward({
    user: eventObj.user,
    tokenId: parseInt(eventObj.tokenId),
    tokenName: eventObj.tokenName,
    tokenAmount: parseInt(eventObj.tokenAmount),
  })
  award.save()
})

provider.on(filter4, (result) => {
  const eventObj = web3.eth.abi.decodeLog(
    TransferSingleJsonInterface.inputs,
    result.data,
    result.topics.slice(1),
  )
  console.log(eventObj)
  const transfer = new transfers({
    operator: eventObj._operator,
    from: eventObj._from,
    to: eventObj._to,
    tokenId: parseInt(eventObj._id),
    tokenAmount: parseInt(eventObj._value),
  })
  transfer.save() //remove comment to start data outputting
})

//welcome Message
router.get('/', (req, res) => {
  res.send('Welcome to BCHIPS API')
})

//transfers
router.get('/transfer', async (req, res) => {
  try {
    const purchase = await transfers.find()
    res.send(purchase)
  } catch (err) {
    res.send('Error ' + err)
  }
})

//TokenIssuance
router.get('/issuance', async (req, res) => {
  try {
    const issue = await tokenIssuance.find()
    res.send(issue)
  } catch {
    res.send('Error ' + err)
  }
})

//TokenAward
router.get('/award', async (req, res) => {
  try {
    const data = await tokenAward.find()
    res.send(data)
  } catch {
    res.send('Error ' + err)
  }
})

//Token purchased
router.get('/purchased', (req, res) => {
  res.send('purchased')
})

module.exports = router
