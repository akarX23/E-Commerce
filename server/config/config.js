const config = {
  production: {
    SECRET: process.env.SECRET,
    DATABASE: process.env.MONGODB_URI,
    USER: process.env.USER,
    PASS: process.env.PASS,
    URL: process.env.URL,
  },
  default: {
    SECRET: "ONLINESHOPSECRET",
    DATABASE: "mongodb://localhost:27017/e-commerce",
    USER: "b2mecommercewebsite@gmail.com",
    PASS: "oabtqmpoalqlqxra",
    URL: "localhost:3000",
  },
};

exports.get = function get(env) {
  return config[env] || config.default;
};
