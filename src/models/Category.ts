import { model, Schema } from 'mongoose';

const schema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true }
});

const Category = model('categories', schema);

export { Category };