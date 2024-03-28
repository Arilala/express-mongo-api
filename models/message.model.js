import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // createdAt, updatedAt
  },
  { timestamps: true }
);

messageSchema.set("toJSON", {
  transform: function (_doc, ret, _options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
