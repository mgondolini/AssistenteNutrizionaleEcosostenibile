exports.auth = function auth(req, res) {
  global.log(req.body);
  res.status(200);
};
