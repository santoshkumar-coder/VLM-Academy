const roleAuthorization = (allowedRoles) => {
    return (req, res, next) => {
      console.log('req_user :', req.user)
      try {
        if (!allowedRoles.includes(req.user.role)) {
          return res
            .status(403)
            .json({success:0, message: "Access denied. Insufficient permissions." });
        }
        next();
      } catch (error) {
        res.status(500).json({success:0, message: "Server error", error: error.message });
      }
    };
  };
  
export default roleAuthorization