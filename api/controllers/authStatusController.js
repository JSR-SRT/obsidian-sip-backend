import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";

export const getAuthStatus = async (req, res) => {
  // Get the token from the cookie
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(200).json({ isLoggedIn: false, user: null });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Find the user from the decoded token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      // If user not found, clear the cookie
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({ isLoggedIn: false, user: null });
    }

    // If token is valid and user exists, return login status
    return res.status(200).json({
      isLoggedIn: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    // If token is invalid or expired
    console.error("Authentication status check failed:", error);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ isLoggedIn: false, user: null });
  }
};
