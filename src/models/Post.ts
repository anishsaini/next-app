import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  mediaPath: string;
  mediaType: 'image' | 'video';
  caption: string;
  likes: mongoose.Types.ObjectId[];
  comments: {
    userId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  mediaPath: { 
    type: String, 
    required: true 
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  caption: { 
    type: String, 
    required: true 
  },
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  comments: [{
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    text: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, { timestamps: true });

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post; 