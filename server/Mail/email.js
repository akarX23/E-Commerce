const nodemailer = require("nodemailer");
const config = require("../config/config").get(process.env.NODE_ENV);

//TEMPLATES
const { Test } = require("./views/test");
const { confirmMail } = require("./views/confirmMail");
const { passwordResetMail } = require("./views/resetPassword");

const getEmailData = (id, token, to, name, template) => {
  let data = null;

  switch (template) {
    case "test":
      data = {
        from: "B2ME <b2mecommercewebsite@gmail.com>",
        to,
        subject: `Hello ${name}`,
        html: Test(),
      };
      break;
    case "confirmEmail":
      data = {
        from: "B2ME <b2meecommercewebsite@gmail.com>",
        to,
        subject: "Verification of email almost done!",
        html: confirmMail(id, token, config.URL, name),
      };
      break;
    case "passwordResetEmail":
      data = {
        from: "B2ME <b2meecommercewebsite@gmail.com>",
        to,
        subject: "Reset your password for B2ME",
        html: passwordResetMail(id, token, config.URL, name),
      };
      break;
    default:
      data;
  }
  return data;
};

const sendEmail = (id, token, to, name, type, cb) => {
  const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.USER,
      pass: config.PASS,
    },
  });

  const mail = getEmailData(id, token, to, name, type);

  smtpTransport.sendMail(mail, (err) => {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      cb(null);
    }

    smtpTransport.close();
  });
};

module.exports = { sendEmail };
