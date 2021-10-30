import { Schema, model } from 'mongoose';

interface User {
  email: string;
  userName: string;
  isAdmin: number;
  password: string;
  updatedAt: Date;
  createdAt: Date;
}

const schema = new Schema<User>({
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
  }
}, { timestamps: true });

const User = model('users', schema);

export { User };