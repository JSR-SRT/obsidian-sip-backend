import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    // exclude passwords in the result
    const users = await User.find().select("-password").sort("-createdAt");
    res.json({ error: false, users, message: "User fetched successfully!" });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch users",
      details: err.message,
    });
  }
};

export const createAccount = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, username, password } = req.body;

    if (!firstname || !lastname || !email || !phone || !username || !password) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ username });
    if (isUser) {
      return res
        .status(409)
        .json({ error: true, message: "Username already exist" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(409)
        .json({ error: true, message: "Email already registered" });

    const user = new User({
      firstname,
      lastname,
      email,
      phone,
      username,
      password,
      role: "user",
    });
    await user.save();

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      error: false,
      user,
      accessToken,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: true,
      message: "Server error, cannot register",
    });
  }
};

export const login = async (req, res) => {
  const { username, password, remember } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: true, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: true, message: "Invalid password" });
    }

    // Generate Access Token (short-lived)
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const isProd = process.env.NODE_ENV === "production";

    // Set Access Token as a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd, // only send over HTTPS in prod
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000, //1 hour
    });

    // Generate and set Refresh Token ONLY if remember is true
    if (remember) {
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/auth/token", // Set path to the refresh token endpoint
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }

    return res.status(200).json({
      error: false,
      message: "Login successful",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
      }, // send some safe public info if needed
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res
      .status(500)
      .json({ error: true, message: "Server error", details: err.message });
  }
};

export const profile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password"); // exclude password
  if (!user) {
    return res.status(404).json({ error: true, message: "User not found" });
  }
  res.status(200).json({ error: false, user });
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// export const login = async (req, res) => {
//   const { username, password, remember } = req.body;

//   if (!username || !password) {
//     return res
//       .status(400)
//       .json({ error: true, message: "Username and password are required" });
//   }

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res
//         .status(401)
//         .json({ error: true, message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res
//         .status(401)
//         .json({ error: true, message: "Invalid password" });
//     }

//     const expiresIn = remember ? JWT_EXPIRES_SHORT : JWT_EXPIRES_LONG;

//     const token = jwt.sign({ userId: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       {expiresIn}
//     );
//     res.json({ error: false, token, message: "Login successful" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: true, message: "Server error", details: err.message });
//   }
// };



// export const authMiddleware = async (req, res) => {
//   if (!req.user) {
//     return res.status(401).json({ error: "Not authenticated" });
//   }
//   res.json({ user: req.user });
// };



// export const verify = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ error: true, message: "Token is required" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.json({
//       error: false,
//       userId: decoded.userId,
//       message: "Token is valid",
//     });
//   } catch (err) {
//     res.status(401).json({ error: true, message: "Invalid token" });
//   }
// };
