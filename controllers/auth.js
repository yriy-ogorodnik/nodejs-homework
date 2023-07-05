const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar")
const path = require('path');
const fs = require("fs/promises")

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

//   генеруємо посилання на тимчасовий аватар і зберігаємо в базі даних
const avatarURL = gravatar.url(email)

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  // записуємо токен в базу людині яка залогінилась
  await User.findByIdAndUpdate(user._id, { token });
  // _____________________

  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};
const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `User with id = ${_id} not found`);
  }
  res.status(200).json({
    status: "success",
    code: 200,
    message: "User subscription updated successfully",
    data: {
      id: result._id,
      email: result.email,
      subscription: result.subscription,
    },
  });
};

const updateAvatar = async(req, res) => {
   const {_id} = req.user
   // шмпортуємо шлях
  const {path: tempUload, originalname} = req.file;
//   робим інікальне імя 
   const filename = `${_id}_${originalname}`
   // сворюємо шлях де має зберігатися за допомогою FS переміщуємо 
   const resultUpload = path.join(avatarsDir, filename)
   await fs.rename(tempUload, resultUpload)

   const avatarURL = path.join("avatars", filename)
   // тепер цей шлях записуємо в базу
   await User.findByIdAndUpdate(_id, {avatarURL})

   res.json({
      avatarURL,
   })
}
module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar)
};
