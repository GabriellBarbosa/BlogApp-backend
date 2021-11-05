import { model, Schema } from 'mongoose'

interface CategoryProps {
  name: string
  slug: string
  updatedAt: Date
  createdAt: Date
}

const schema = new Schema<CategoryProps>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
)

const Category = model('categories', schema)

export { Category }
