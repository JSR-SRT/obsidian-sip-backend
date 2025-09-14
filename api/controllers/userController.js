import { User } from "../../models/User.js";

// GET User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // req.user comes from authUser(), .select("-password") is to exclude password retrieval
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    res.status(200).json({ error: false, user });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: err.message,
    });
  }
};

// UPDATE User Profile
export const updateProfile = async (req, res) => {
  const { firstname, lastname, email, phone, address } = req.body; // req.user comes from authUser(), .select("-password") is to exclude password retrieval
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    if (
      firstname === user.firstname &&
      lastname === user.lastname &&
      email === user.email &&
      phone === user.phone &&
      address === user.address
    ) {
      return res
        .status(400)
        .json({ error: true, message: "No changes provided" });
    }
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res
          .status(400)
          .json({ error: true, message: "Email already in use" });
      }
    }
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    await user.save();
    res.status(201).json({ error: false, message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: err.message,
    });
  }
};

// DELETE User Profile
export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // req.user comes from authUser()
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    await User.findByIdAndDelete(req.user._id);
    return res.json({
      error: false,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: err.message,
    });
  }
};
