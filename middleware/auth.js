import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Kindly login to continue with your order. ☕",
      });
  }
  try {
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    req.user =  { _id: decoded_token.userId };
    next();
  } catch (err) {
    const isExpired = err.name === "TokenExpiredError";
    res.status(401).json({
      error: true,
      code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
      message: isExpired
        ? "Token has expired, please log in again."
        : "Invalid token.",
    });
  }
};
