const userService = require("../services/user_service");

exports.register = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }

    const { firstName, lastName, email, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
      console.log("Missing required fields:", {
        email: !!email,
        password: !!password,
        firstName: !!firstName,
        lastName: !!lastName,
      });
      return res.status(400).json({
        success: false,
        message: "Registration failed: All fields are required",
      });
    }
    console.log("Registration attempt:", { email, firstName, lastName });

    const user = await userService.registerUser({
      email,
      password,
      firstName,
      lastName,
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for verification link",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    await userService.verifyEmail(token);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error verifying email",
    });
  }
};

exports.login = async (req, res) => {
  console.log("login hit")
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }

    const { email, password } = req.body;
    console.log("🚀 ~ exports.login= ~ email, password:", email, password)
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    console.log("Login attempt", { email });

    const { token, user } = await userService.loginUser(email, password);

    // Set token in cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(error.status || 401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    console.log("Logging out user:", req.user.email);
    res.clearCookie("auth_token");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
};

exports.getResetPasswordToken = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    console.log("Password reset request for email:", email);

    await userService.initiatePasswordReset(email);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error initiating password reset",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }

    const { token, newPassword, email } = req.body;
    if (!token || !newPassword || !email) {
      return res.status(400).json({
        success: false,
        message: "Token, new password and email are required",
      });
    }

    await userService.resetPassword(token, email, newPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error resetting password",
    });
  }
};


