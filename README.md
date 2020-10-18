# E-Commerce
This is an E-Commerce Web App. 

Technologies Used in this app :-

# Backend
*MongoDB
*Express
*Node
*NodeMailer
*MongoDB Atlas

# Frontend
*React
*Redux
*Material UI
*React-Scroll Magic
*React-Reveal
*React-Bootstrap
*Tailwind CSS

# Common
*RazorPay
*Cloudinary

# Deployment
*Heroku

This app has two kind of user functionalities -: 
*User
*Admin

These roles are managed by one variable inside the user schema. All authorised api routes pass through a custom auth middleware which returns false for un authorised users.

The html templates are in the views folder in server/Mail.

In the front end all routes are a child of a higer order component Auth which redirects you in case of a restricted route.

# Issues which I am not able to solve yet: 

*Prompts from React were not working. I have no idea why. I then used a library called Navigation Prompt. That worked for all routes but not when I went to /user/cart. Still no idea why.

*Some classes have not been loaded. Like in development mode I get a nice backdrop when the loading icon shows. But in production it does not come. I even tried to import the class directly into the components I have used it in but still not working.

