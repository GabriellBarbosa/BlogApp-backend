import express from 'express'
import 'express-async-errors'
import env from 'dotenv'
import { createConnection } from '@database/index'
import { routes as admin } from '@routes/admin'
import { routes as post } from '@routes/post'
import { routes as auth } from '@routes/auth'
import { routes as comment } from '@routes/comment'
import { handleErrors } from '@middlewares/error'

env.config()
createConnection()
const app = express()

// @desc Express config
app.use(express.json())

// @desc Routes
app.use('/admin', admin)
app.use('/posts', post)
app.use('/auth', auth)
app.use('/comments', comment)

// @desc Handle app errors
app.use(handleErrors)

export { app }
