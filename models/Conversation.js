
import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
   sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
   receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }
  ],
},{
    timestamps: true,
});
const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
export default Conversation