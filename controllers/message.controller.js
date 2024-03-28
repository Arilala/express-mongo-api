import logger from "../logger/logger.js";

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    console.log(req.body);
    const { message } = req.body;
    const { id: receiveerId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiveerId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiveerId],
      });
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiveerId,
      message: message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiveerId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    logger.error(`sendMessage  [${error.message}]`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    return res.status(200).json(conversation.messages);
  } catch (error) {
    logger.error(`getMessages  [${error.message}]`);
    res.status(500).json({ error: "Internal server error" });
  }
};
