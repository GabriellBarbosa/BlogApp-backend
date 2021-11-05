import nodemailer from 'nodemailer'
import env from 'dotenv'

env.config()
const mailPort = Number(process.env.MAIL_PORT)

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: mailPort,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

export { transporter }
