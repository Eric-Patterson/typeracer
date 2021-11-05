// this returns a function, that accepts that functions, then executes that function
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
