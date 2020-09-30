const passwordResetMail = (id, token, url, name) => {
  return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Document</title>
            <style>
              body {
                  margin: 0;
                  padding: 0;
                  text-align: center;
              }
  
              h1 {
                  font-size: 40px;
                  color: green;
                  margin: 15px auto;
              }
  
              h3 {
                  font-size: 30px;
                  color: red;
                  margin: 15px auto;
              }
  
              a {
                  text-decoration: none;
              }
  
              button {
                  padding: 5px;
                  width: 100px;
                  heigh: 70px;
                  background: green;
                  color: white;
                  transition: all 0.4s ease-in;
                  border-radius: 5px;                
                  cursor: pointer;
              }
  
              button:hover {
                  background: #2f855a;
              }
            </style>
        </head>
        <body>  
            <h1>Hi ${name}, You requested a reset password for your account.</h1>
            <h3> Click the link below to reset your password.</h3>
            <a href="http://${url}/user/reset/${id}/${token}"><button>Reset</button></a>
        </body>
        </html>`;
};

module.exports = { passwordResetMail };
