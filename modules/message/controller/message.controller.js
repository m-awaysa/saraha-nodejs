const { messageModel } = require("../../../DB/model/message.model");
const { userModel } = require("../../../DB/model/user.model");

const sendMessage = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { message } = req.body;
    const user = await userModel.findById(receiverId);
    if (user) {
      const newMessage = await new messageModel({ text: message, receiverId });
      const savedMessage = await newMessage.save();
      res.json({ message: "success" });
    } else {
      res.json({ message: "receiver not found" });
    }
  } catch (error) {
    res.json({ message: 'catch error', error });
  }
}

const userMessages = async (req, res) => {
  try {
    const messages = await messageModel.find({ receiverId: req.userId });

    res.json({ message: "success", messages });
  } catch (error) {
    res.json({ message: 'catch error', error });
  }
}

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await messageModel.findOneAndDelete({ _id: messageId, receiverId: req.userId });
    if (message) {
      res.json({ message: "success", message });
    } else {
      res.json({ message: "invalid message" });
    }
  } catch (error) {
    res.json({ message: 'catch error', error });
  }

}
module.exports = { sendMessage, userMessages, deleteMessage };