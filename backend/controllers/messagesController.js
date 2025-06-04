const Message = require('../models/messagesModel');

// Sukurti žinutę
exports.createMessage = async (req, res) => {
  try {
    const { name, email, text } = req.body;
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    console.log('Gauta žinutė:', { name, email, text, ip });
    const newMessage = new Message({ name, email, text, ipAddress: ip });
    await newMessage.save();
    console.log('Išsaugota žinutė:', newMessage);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Klaida išsaugant žinutę:', err);
    res.status(500).json({ message: 'Nepavyko išsaugoti žinutės' });
  }
};

// Gauti visas žinutes (adminui)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Nepavyko gauti žinučių' });
  }
};

// Ištrinti žinutę (adminui)
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Žinutė nerasta' });
    res.status(200).json({ message: 'Žinutė ištrinta' });
  } catch (err) {
    res.status(500).json({ message: 'Nepavyko ištrinti žinutės' });
  }
};

// Redaguoti žinutę (adminui)
exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const updated = await Message.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Žinutė nerasta' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Nepavyko atnaujinti žinutės' });
  }
};
