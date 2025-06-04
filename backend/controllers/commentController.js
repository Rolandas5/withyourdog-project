const Comment = require('../models/commentModel');
const DogProfile = require('../models/dogProfileModel');

// Komentaro sukūrimas
exports.createComment = async (req, res) => {
  try {
    const { entityId, entityType, text } = req.body;
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    // Debug: parodyk kas yra req.user
    console.log('DEBUG req.user:', req.user);

    // Gauti šuniuko nuotrauką pagal userId
    let avatarUrl = '';
    try {
      const dog = await DogProfile.findOne({ userId: req.user._id });
      if (dog && dog.avatarUrl) {
        if (
          dog.avatarUrl.startsWith('http') ||
          dog.avatarUrl.startsWith('/uploads')
        ) {
          avatarUrl = dog.avatarUrl;
        } else {
          avatarUrl = `/uploads/${dog.avatarUrl}`;
        }
      } else {
        avatarUrl = '/default-dog-avatar.png';
      }
    } catch (e) {
      avatarUrl = '/default-dog-avatar.png';
    }

    const newComment = new Comment({
      entityId,
      entityType,
      userId: req.user._id,
      username: req.user.name,
      text,
      ipAddress: ip,
      avatarUrl,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Klaida kuriant komentarą:', err);
    res.status(500).json({ message: 'Nepavyko sukurti komentaro' });
  }
};

// Gauti komentarus pagal entity
exports.getCommentsForEntity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const comments = await Comment.find({ entityType, entityId }).sort({
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
