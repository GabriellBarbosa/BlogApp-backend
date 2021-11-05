import { Schema, model } from 'mongoose'

interface Props {
  author: Schema.Types.ObjectId
  content: string
  slug: string
  category: Schema.Types.ObjectId
  updatedAt: Date
  createdAt: Date
}

const schema = new Schema<Props>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true
    }
  },
  { timestamps: true }
)

const Post = model('posts', schema)

export { Post }
