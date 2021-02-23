const express = require('express')
const Result = require('../models/Result')
const { login } = require('../services/user')
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')
const { md5 } = require('../utils')
// const { body, validationResult } = require('express-validator')
// const boom = require('boom')
// const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/info', function (req, res, next) {
    res.json('user info...')
})

router.post('/login', function (req, res) {
    let { username, password } = req.body
    password = md5(`${password}${PWD_SALT}`)

    login(username, password).then(user => {
        if (!user || user.length === 0) {
            new Result('登录失败').fail(res)
        } else {
            new Result('登录成功').success(res)
        }
    })
})

module.exports = router