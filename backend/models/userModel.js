const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      // unikalus, neleidžiam susikurti dviejų vartotojų su tuo pačiu email
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Ši funkcija skirta tam, kad prieš išsiunčiant slaptažodį į duomenų bazę jis būtų užkoduojamas
// Prieš išsaugant slaptažodį jį užkoduojame su bcrypt ir paverčiame jį į hash'ą
userSchema.pre('save', async function (next) {
  // Jei slaptažodis nebuvo pakeistas, tiesiog einame toliau ir neskaitome kodo is šitos funkcijos
  if (!this.isModified('password')) {
    return next(); // einame toliau
  }

  try {
    // Užkoduojame slaptažodį su bcrypt
    // salt - tai yra papildomas slaptažodis, kurį sugeneruoja ant viršaus egzistuojančio slaptažodžio
    // Tai yra papildomas saugumo sluoksnis, kad slaptažodis būtų sunkiau nulaužiamas
    const salt = await bcrypt.genSalt(10); // 10 - tai yra slaptumo lygis, kuo didesnis skaičius, tuo ilgiau užtrunka sugeneruoti hash'ą
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // jei įvyko klaida, einame toliau su klaida
  }
});

// Tikriname ar slapta=odis sutampa su MongoDB ir žmogaus įvestu
userSchema.methods.comparePassword = async function (password) {
  // bcrupt.compare() palygina du slaptažodžius
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
// User - tai yra modelis, kuris bus naudojamas autentifikacijos metu
