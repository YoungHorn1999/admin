const express = require('express')
const router = require('./router')
const fs = require('fs')
const https = require('https')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', router)

const privateKey = fs.readFileSync('./https/5208955_younghorn.com.key')
const pem = fs.readFileSync('./https/5208955_younghorn.com.pem')
const credentials = {
    key: privateKey,
    cert: pem
}
const httpServer = https.createServer(credentials, app)

const server = app.listen(5000, function () {
    const { address, port } = server.address()
    console.log('HTTP服务启动成功: http://%s:%s', address, port);
})

httpServer.listen(8888, function () {
    console.log('HTTPS Server is running on: https://localhost:%s', 8888);
})