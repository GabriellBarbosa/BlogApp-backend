import { Schema, model } from 'mongoose';

interface Comment {
  author: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  comment: string;
  updatedAt: Date;
  createdAt: Date;
}

const schema = new Schema<Comment>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'posts',
    required: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

const Comment = model('comments', schema);

export { Comment };