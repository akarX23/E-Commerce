const config = {
  production: {
    SECRET: process.env.SECRET,
    DATABASE: process.env.MONGODB_URI,
    USER: process.env.USER,
    PASS: process.env.PASS,
    URL: process.env.URL,
    CLOUD_URL: process.env.CLOUD_URL,
    PRESET: process.env.PRESET,
    RAZOR_PAY_KEY_ID: process.env.RAZOR_PAY_KEY_ID,
    RAZOR_PAY_KEY_SECRET: process.env.RAZOR_PAY_KEY_SECRET,
  },
  default: {
    SECRET: "ONLINESHOPSECRET",
    DATABASE: "mongodb://localhost:27017/e-commerce",
    USER: "b2mecommercewebsite@gmail.com",
    PASS: "oabtqmpoalqlqxra",
    URL: "localhost:3000",
    CLOUD_URL: "https://api.cloudinary.com/v1_1/dyhrqpsrs/image/upload",
    PRESET: "qelivzfz",
    RAZOR_PAY_KEY_ID: "rzp_test_d3gIhUbFAEGwOd",
    RAZOR_PAY_KEY_SECRET: "hrN8q4vwJYPVP1PG9avqwpdB",
  },
};

exports.get = function get(env) {
  return config[env] || config.default;
};
