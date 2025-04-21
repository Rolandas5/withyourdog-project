const User = require('../models/userModel'); // Importuojame User modelį
const jwt = require('jsonwebtoken'); // Importuojame jwt biblioteką

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Patikriname, ar visis laukai užpildyti
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    // 2. Patikriname ar email jau toks egzistuoja mūsų duomenų bazėje
    if (existingUser) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 3. Sukuria naują vartotoją
    const user = new User({
      name,
      email,
      password,
    });

    user.save();

    // 4. Sugeneruojame JWT tokeną
    // id - tai yra vartotojo ID, kurį leis mums atpažinti, kuris čia useris kreipiasi i serverį
    // JWT_SECRET - tai yra Serverio slaptažodis, kad niekas negalėtų padirbti tokeno
    // expiresIn - tai yra laikas po kurio tokenas bus nebegaliojantis
    // TOKENAS NĖRA SAUGOMAS DUOENMŲ BAZĖJE, JIS ATIDUODAMAS NAUDOTOJUI!!!
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res
      .status(201)
      .json({ access_token: token, message: 'Registracija teisinga' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    // 1. Patikriname ar žmogus užpildė visus Input laukus
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 2. Patikriname ar useris egzistuoja mūsų duomenų bazėje
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 3. Patikriname ar slaptažodis sutampa su duomenų bazėje esančiu slaptažodžiu
    // gražins true/false
    const isPasswordValid = await existingUser.comparePassword(
      req.body.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // 4. Sugeneruojame JWT tokeną
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    // 5. Atiduodame tokeną žmogui
    // tokenas bus saugomas naršyklės localStorage
    res
      .status(201)
      .json({ access_token: token, message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // 1. Išsitraukiame tokeną iš requesrt headerio (užklausos)
    const token = req.header('Authorization')?.replace('Bearer ', ''); // gauname tokeną iš užklausos
    // 2. Patikriname ar tokenas egzistuoja
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // 3. Patikriname ar tokenas yra validus (ar jis galioja)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Išsitraukiame Userio duomenis is duomenu bazės pagal ID, išskyrus slaptažodį
    const user = await User.findById(decoded.userId).select('-password'); // -password - tai yra, kad negrąžintume slaptažodžio

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user); // grąžiname vartotojo duomenis
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
