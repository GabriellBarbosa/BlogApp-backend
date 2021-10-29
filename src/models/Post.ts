import { Schema, model } from "mongoose";

interface Post {
  content: string;
  slug: string;
  category: Schema.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const schema = new Schema<Post>({
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
}, { timestamps: true });

const Post = model('posts', schema);

export { Post };