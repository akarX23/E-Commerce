# Server
We use **Express JS** to set up our server.
```
app.use(bodyParser.json());
app.use(cookieParser());
const app = express();
```

# Connecting to the database
We use MongoDB Atlas which is a cloud storage for MongoDB Database.
```
mongoose.connect(
  "mongodb+srv://akarX:ritik@e-commerce.ucyuc.mongodb.net/E-Commerce?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) console.log("Error in DB connection : " + err);
    else console.log("MongoDB Connection succeeded");
  }
);
```

# Config File
The config file returns the constants we use through the app like secret keys for encryption and credentials for razor pay account and cloudinary.

The config file will return the set of variables according to the **environment** we are working on.
```
const config = require("./config/config").get(process.env.NODE_ENV);
exports.get = function get(env) {
  return config[env] || config.default;
};
```

# Middlewares
We use one custom middle ware for many of our requests. A middleware is something that is called before the request is executed.
## Auth
The auth middleware allows us to restrict the user from visiting any restricted routes. If we are using auth middleware with some request and the user isn't logged in, it will just return a response with an error and prevent the user from proceeding.
```
if (!user || user.validated === false)
  return res.status(200).json({
    isAuth: false,
    error: true,
  });
```

# Requests
## User Requests
Some methods to know in the User Model:
- `user.generateAuthToken()` uses JWT to sign a token using the user's id in the database and saves that token to the user.
- `sendEMail` is an import from `/server/Mail/email.js`. This is used to send email confirmation and password reset mails using nodemailer. It uses the html templates defined in the `/server/Mail/views` folder. 
- The **Pre Save** hook saves the password of the user if its a new user or the password is changed.
```
userSchema.pre("save", function (next) {

  bcrypt.genSalt(salt_i, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});
```

`const sendEmail = (id, token, to, name, type, cb)`
### Post Requests
#### Register
```
/api/user/register
```
It receives the user details as the body
```
{
  email,
  password,
  mobile,
  name, 
  lastname,
  address
}
```
The user details are checked and appropriate responses are sent in case of flaws. In case the details check out a token is generated for the user and that token is sent to the sendEmail function
```
sendEmail(
    id,
    token,
    user.email,
    `${user.name} ${user.lastname}`,
    "confirmEmail",
    (err) => {
      if (err) return cb(err);
      return cb(null);
    }
  );
```
The "confirm email" template is chosen from the views folder and an email is sent to the user which includes a verification link with this generated token embedded into it.
This token is also saved in the Token Model which expires after 300 seconds.

When the user clicks the link, the token embedded in it is extracted and sent back to the server. This is checked with the Token collection and the user database. If the token still exists in the Token collection and the user is found with this token a successfull verification response is sent to the client.
```
Token.findOne({ token: token }, (err, token) => {
  User.findById(id, (err, user) => {
    user.confirmEmail((err, user) => {
       return res.status(200).json({
            changeAuth: true,
            verification: { verified: true, new: true },
            user
          });
```
And in the confirm mail method in user model, we create the new Cart and Order Histories for the user.
```
new Cart({ _id: user._id, products: [] }).save((err, doc) => {
    if (err) return cb(err);
  });
  new OrderHistory({ owner: user._id, entries: [] }).save((err, doc) => {
    if (err) return cb(err);
  });
  ```
  
  #### Log In
  ```
 /api/user/login
 ```
 It recieves log in details as the body
 ```
 {
    email,
    password
 }
```
If the user is found in the database, the compare passwords function is called where we becrypt's compare method.
```
bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
    return cb(null, isMatch);
  });
```
Then a new token is generated and that token is saved to the cookies of the browser. A success response is then sent back.
```
user.generateAuthToken((err, user) => {
  if (err) return res.status(400).send(err);

  res.cookie("auth", user.token);
  return res.status(200).json({
    isAuth: true,
```

#### Reset Password Link
A new token is generated for the user and saved to the Token collection with expiry of 300 seconds. Then a mail is sent through sendEmail function with the token and id embedded into it.
```
user.sendPasswordResetLink(user.token, user._id, (err) => {
  if (err) return res.status(200).json({ linksent: false });

  return res.status(200).json({
    linksent: true,
  });
});
```

#### Reset Password
```
/api/user/resetPassword
```
The reset password link is intended to be opened only once. So as soon as the page loads a request is sent with `tokenVerified: false`. 

The token sent in the body is then checked in the token collection and if found, it is deleted so that another request cannot be made.
```
Token.findOneAndUpdate(
  { token: token },
  { $unset: { token: 1 } },
```
After the user has submitted a new password, `tokenVerified: true` is sent to the api in the body. Now the password is changed and saved to the user database.

Also the cookie is set to the user's token and the user is logged in.

#### Admin Add User
```
/api/admin/addUser
```
It checks if the user is logged in or not thorugh the auth middle ware. In the body it receives the details of th euser to add.
```
{
  email,
  password,
  mobile,
  name, 
  lastname,
  address,
  validated: true
}
```
The additional `validated: true` is what makes the user verified without mail. This key is added in the redux store itself.

#### Promote user
```
/api/admin/promoteUser
```
The user's role is changed from 0 to 1 and saved.

### GET Requests

#### User List
```
/api/admin/user-list
```
If an admin is logged in, this returns the list of all users excluding their passwords and address.

#### Logout
```
/api/user/logout
```
Unsets the current token of the logged in user and also resets the browser cookie.

###  UPDATE Requests
```
/api/user/update
```
Gets the user details in the body and user id from auth middleware and updates the user details.

### DELETE Requests
```
/api/user/delete
```
Deletes all the user products and comments as well, the cart and order history of the user from the database.

## Product Requests




























