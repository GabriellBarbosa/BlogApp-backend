import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

interface UserProps {
  email: string
  userName: string
  isAdmin: number
  password: string
  passwordResetToken: string
  passwordResetExpires: Date
  updatedAt: Date
  createdAt: Date
}

const schema = new Schema<UserProps>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    userName: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    isAdmin: {
      type: Number,
      default: 0
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true
    },
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpires: {
      type: Date,
      select: false
    }
  },
  { timestamps: true }
)

schema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  return next()
})

const User = model('users', schema)

export { User }
