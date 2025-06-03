const Comment = require('../models/commentModel');

// Komentaro sukūrimas
exports.createComment = async (req, res) => {
  try {
    const { placeId, placeType, text } = req.body;
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    const newComment = new Comment({
      placeId,
      placeType,
      userId: req.user._id,
      userName: req.user.username,
      text,
      ipAddress: ip,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Klaida kuriant komentarą:', err);
    res.status(500).json({ message: 'Nepavyko sukurti komentaro' });
  }
};

// Gauti komentarus pagal vietą
exports.getCommentsForPlace = async (req, res) => {
  try {
    const { placeType, placeId } = req.params;

    const comments = await Comment.find({ placeType, placeId }).sort({
      createdAt: -1,
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Nepavyko gauti komentarų' });
  }
};

// Komentaro atnaujinimas
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const updated = await Comment.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Komentaras nerastas' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Klaida atnaujinant komentarą:', err);
    res.status(500).json({ message: 'Serverio klaida' });
  }
};

// Komentaro ištrynimas
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Comment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Komentaras nerastas' });
    }

    res.status(200).json({ message: 'Komentaras ištrintas' });
  } catch (err) {
    console.error('Klaida trinant komentarą:', err);
    res.status(500).json({ message: 'Serverio klaida' });
  }
};

// Gauti visus komentarus (adminui)
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    console.error('Klaida gaunant visus komentarus:', err);
    res.status(500).json({ message: 'Nepavyko gauti komentarų' });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Nepavyko gauti komentarų' });
  }
};
