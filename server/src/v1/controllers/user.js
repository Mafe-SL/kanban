const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jsonwebtoken = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { password } = req.body;
  try {
    req.body.password = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_SECRET_KEY
    );

    const user = await User.create(req.body);
    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select("password username");
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            param: "username",
            msg: "Invalid username or password",
          },
        ],
      });
    }

    const decryptedPass = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPass !== password) {
      return res.status(401).json({
        errors: [
          {
            param: "username",
            msg: "Invalid username or password",
          },
        ],
      });
    }

    user.password = undefined;

    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.firebaseSignup = async (req, res) => {
  const { email, uid } = req.body;

  try {
    // Verifica si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Si el usuario ya existe, genera un nuevo token y devuélvelo
      const token = jsonwebtoken.sign(
        { id: existingUser._id },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: "24h" }
      );
      return res.status(200).json({ user: existingUser, token });
    }

    // Si el usuario no existe, crea uno nuevo en la base de datos
    const newUser = new User({ email, firebaseUid: uid });
    await newUser.save();

    // Genera un token para el nuevo usuario y devuélvelo
    const token = jsonwebtoken.sign(
      { id: newUser._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );
    return res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json(err);
  }
};
