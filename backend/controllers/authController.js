const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Registracija
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Patikriname, ar visi laukai užpildyti
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Būtina užpildyti visus laukus' });
    }

    // 2. Patikriname, ar el. paštas jau egzistuoja mūsų duomenų bazėje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'Nepavyko užregistruoti. Patikrinkite duomenis.' });
    }

    // 3. Sukuriame naują vartotoją
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    const user = new User({
      name,
      email,
      password,
      ipAddress: ip,
    });

    await user.save();

    // 4. Sugeneruojame JWT tokeną
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res
      .status(201)
      .json({ access_token: token, message: 'Registracija sėkminga!' });
  } catch (error) {
    res.status(500).json({ error: 'Serverio klaida. Bandykite dar kartą.' });
  }
};

// Prisijungimas
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Patikriname ar žmogus užpildė visus laukus
    if (!email || !password) {
      return res.status(400).json({ error: 'Būtina užpildyti visus laukus' });
    }

    // 2. Patikriname ar useris egzistuoja mūsų duomenų bazėje
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ error: 'Neteisingas el. paštas arba slaptažodis' });
    }

    // 3. Patikriname ar slaptažodis teisingas
    const isPasswordValid = await existingUser.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ error: 'Neteisingas el. paštas arba slaptažodis' });
    }

    // 4. Sugeneruojame JWT tokeną
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    // Pašalinam slaptažodį iš user objekto
    const userObj = existingUser.toObject();
    delete userObj.password;

    res.status(201).json({
      access_token: token,
      user: userObj,
      message: 'Prisijungimas sėkmingas!',
    });
  } catch (error) {
    res.status(500).json({ error: 'Serverio klaida. Bandykite dar kartą.' });
  }
};

// Grąžina dabartinį vartotoją (autorizuotas vartotojas)
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res
        .status(401)
        .json({ error: 'Sesija baigėsi arba neprisijungėte' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Vartotojas nerastas' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Serverio klaida. Bandykite dar kartą.' });
  }
};

// (Jei reikia admin funkcijų)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Neturite teisės matyti šių duomenų' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Serverio klaida. Bandykite dar kartą.' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Neturite teisės keisti vartotojų roles' });
    }
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Serverio klaida. Bandykite dar kartą.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Tik adminas gali trinti vartotojus
    if (!req.user || req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Neturite teisės trinti vartotojų' });
    }
    const { userId } = req.params;
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({ error: 'Vartotojas nerastas' });
    }
    res.status(200).json({ message: 'Vartotojas ištrintas' });
  } catch (error) {
    res.status(500).json({ error: 'Serverio klaida. Bandykite dar kartą.' });
  }
};
