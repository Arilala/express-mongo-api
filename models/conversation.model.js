import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

conversationSchema.set("toJSON", {
  transform: function (_doc, ret, _options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
