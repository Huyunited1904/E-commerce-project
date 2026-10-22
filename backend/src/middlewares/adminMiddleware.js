export const adminMiddleware = (req, res, next) => {
  if (req.userRole !== "admin") {
    const error = new Error(
      "You do not have permission to perform this action"
    );

    error.statusCode = 403;
    return next(error);
  }

  next();
};