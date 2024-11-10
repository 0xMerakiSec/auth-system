import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const user = new User({
      email,
      password,
      name,
    });
    await user.save();

    const { accessToken, refreshToken } = generateToken(user._id);
    user.refreshTokens.push({
      token: refreshToken,
      expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await user.save();
    res.status(201).json({
      user: { id: user._id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentails" });
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentails" });
    }

    const { accessToken, refreshToken } = generateToken(user._id);
    user.refreshTokens.push({
      token: refreshToken,
      expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();
    res.status(200).json({
      user: { id: user._id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    //verify the resfresh token exist and is valid
    const tokenDoc = user.refreshTokens.find((t) => t.token === refreshToken);

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const tokens = generateToken(user._id);
    res.status(201).json({ accessToken: tokens.accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user._id;
    await User.updateOne(
      { _id: userId },
      { $pull: { refreshTokens: { token: refreshToken } } }
    );
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

export { register, login, refreshToken, logout };
