const express = require('express')
const Result = require('../models/Result')
const { login } = require('../services/user')
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')
const { md5 } = require('../utils')
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/info', function (req, res, next) {
    res.json('user info...')
})

router.post(
    '/login',
    [
        body('username').isString().withMessage('用户名必须为字符'),
        body('password').isString().withMessage('密码必须为字符')
    ],
    function (req, res, next) {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            const [{ msg }] = err.errors
            next(boom.badRequest(msg))
        } else {
            let { username, password } = req.body
            password = md5(`${password}${PWD_SALT}`)

            login(username, password).then(user => {
                if (!user || user.length === 0) {
                    new Result('登录失败').fail(res)
                } else {
                    const token = jwt.sign(
                        { username },
                        PRIVATE_KEY,
                        { expiresIn: JWT_EXPIRED }
                    )
                    new Result({ token }, '登录成功').success(res)
                }
            })
        }

    })

module.exports = router