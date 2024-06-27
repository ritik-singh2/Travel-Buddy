//both middlewares require auth middleware to execute before them

const superAdmin = (req, res, next) => {
  try {
    if (req.userPrivilege != 0) {
      return res
        .status(401)
        .json({ message: "Only Super Admin can perform this operation" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized User" });
  }
};

// use for course creation
const superandadmin = (req, res, next) => {
  try {
    if (req.userPrivilege == 2) {
      return res.status(401).json({
        message: "Only Super Admin and Admin can perform this operation",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized User" });
  }
};

export { superAdmin, superandadmin }

