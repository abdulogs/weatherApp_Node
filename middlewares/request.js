const AppendRequest = (req, res, next) => {
  res.locals.request = req;
  next();
};

export default AppendRequest;