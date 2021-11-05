import { connect } from 'mongoose'

const createConnection = async () => {
  try {
    await connect(process.env.DB)
  } catch (err) {
    console.log(`Connection error: ${err}`)
  }
}

export { createConnection }
