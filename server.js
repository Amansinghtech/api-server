const express = require('express')
require('dotenv').config()
const app = express()
const port = 3004
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection
  .once('open', () => {
    console.log('Database Connected')
  })
  .on('error', (error) => console.error(error))

app.use(express.json())
const tokenRouter = require('./routes/tokenRoutes')

app.use('/api', tokenRouter)

app.listen(port, () => console.log(`Server started port 3004`))
