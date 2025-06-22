import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const  connectToDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/pidify`)
    console.warn('CONNECTED TO DB')
  } catch(e) {
    console.warn(e)
  }
}

export {
  connectToDB
}
