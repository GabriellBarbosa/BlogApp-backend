import { model, Schema } from 'mongoose';

interface Category {
  name: string;
  slug: string;
  updatedAt: Date;
  createdAt: Date;
}

const schema = new Schema<Category>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true }
  },
  {
    timestamps: true
  }
);

const Category = model('categories', schema);

export { Category };