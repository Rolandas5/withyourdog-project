const Comment = require('../models/commentModel');

const checkCommentOwner = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Komentaras nerastas' });
    }

    const isOwner = comment.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: 'Neturi leidimo atlikti šio veiksmo' });
    }

    next();
  } catch (error) {
    console.error('Klaida tikrinant komentaro savininką:', error);
    res.status(500).json({ message: 'Serverio klaida tikrinant teisę' });
  }
};

module.exports = checkCommentOwner;
