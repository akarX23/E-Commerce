const config = {
  production: {
    SECRET: process.env.SECRET,
    DATABASE: process.env.MONGODB_URI,
  },
  default: {
    SECRET: "ONLINESHOPSECRET",
    DATABASE: "mongodb://localhost:27017/e-commerce",
  },
};

exports.get = function get(env) {
  return config[env] || config.default;
};
