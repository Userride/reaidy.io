const r = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

r.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const h = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: h });
  res.json({ 
    token: jwt.sign({ id: user._id }, process.env.JWT_SECRET), 
    user: { id: user._id, name, email }
  });
});

r.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(400).json({ msg: "No user" });
  if (!await bcrypt.compare(password, u.password)) 
    return res.status(400).json({ msg: "Wrong password" });
  
  res.json({ 
    token: jwt.sign({ id: u._id }, process.env.JWT_SECRET), 
    user: { id: u._id, name: u.name, email }
  });
});

module.exports = r;
