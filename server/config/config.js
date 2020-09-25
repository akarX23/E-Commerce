const config = {
  production: {
    SECRET: process.env.SECRET,
    DATABASE: process.env.MONGODB_URI,
    USER: process.env.USER,
    PASS: process.env.PASS,
    URL: process.env.URL,
    CLOUD_URL: process.env.CLOUD_URL,
    PRESET: process.env.PRESET,
  },
  default: {
    SECRET: "ONLINESHOPSECRET",
    DATABASE: "mongodb://localhost:27017/e-commerce",
    USER: "b2mecommercewebsite@gmail.com",
    PASS: "oabtqmpoalqlqxra",
    URL: "localhost:3000",
    CLOUD_URL: "https://api.cloudinary.com/v1_1/dyhrqpsrs/image/upload",
    PRESET: "qelivzfz",
  },
};

exports.get = function get(env) {
  return config[env] || config.default;
};
