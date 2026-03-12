import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  username: {
    type: String,
  },

  role: { 
    type: String, 
    enum: ['user', 'bot'], 
    required: true 
  },

  content: { 
    type: String, 
    required: true 
  },

}, { timestamps: true });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);