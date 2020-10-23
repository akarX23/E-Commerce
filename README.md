# Overview
This is an E-Commerce Web App. It includes all the basic functionalities like user log in sign up as well as an admin panel and a payment gateway system. I have also included mail sending functionalities for better user experience. I have tried to work with as many dependencies as possible on both client and server side as this was my first major project. You can find the documentation for client and server in their respective folders. Thank you for visiting my website!

# How to start the app

## Required dependencies : 
- Node JS should be installed. [Install](https://nodejs.org/en/download)
- JavaScript should be enabled in your browser.
- MongoDB should be installed. [Download here](https://www.mongodb.com/try/download/community) and run installer.

## Start the MongoDB Server
1. Open File Explorer
2. Go to C:/Program Files/MongoDB/Server/4.2(or some other version)/bin
3. Copy this path.
4. Open command prompt. 
5. Type `cd /`
6. Type `cd <paste the path you copied here>`
7. Hit enter
  
*Now we have to create the database folder for mongoDB. You can create a custom folder if you want or use the default one that mongoDB creates. If you create a custom folder please copy the path to that folder.*

8. If you have not created a custom folder then type `mongod.exe` and hit enter.
9. If you have created a custom folder then type `mongod.exe --dbpath "<paste the path to your folder here>"` and hit enter.

*Open another command prompt. Repeat steps 1 through 7*

10. Type `mongo.exe` and hit enter.

**Out MongoDB server has started!**

## Steps to start the app
- Clone the repository.
- Navigate to the E-Commerce directory in your terminal.
- Run the following commands.
  1. `npm install --save` This will install dependencies on the server side.
  2. `cd client` This will navigate to the client directory.
  3. `npm install --save` This will install dependencies on the client-side.
  5. `cd ..` Jump back to E-Commerce directory.
  7. `npm run dev` Start the project by running the required scripts on the server and client side. 

### Server runs on Port 5000 and Client runs on Port 3000. 

## Errors you might face 
- If the above mentioned ports are not free then errors will appear. So make sure your ports are free.
- If node is not installed then the app will crash. Run `node -v` from anywhere in your terminal. If it shows error then re-install node.
- In case any other error, start the whole process again from cloning the repo.

# Major libraries used : 

#### Front-end : 
- React
- Redux
- Material UI
- React-Bootstrap
- Tailwind CSS

#### Back-end :
- Node 
- Express
- Mongoose
- MongoDB Atlas

#### Common : 
- Razor Pay for Payment Gateway
- Cloudinary for cloud image storage

# Issues
##### Please do visit the issues section for some problems you might be interested to solve. Any contribution will be very much appreciated.

# Credits
### Owner and creater - Ritik Agrawal
[GitHub Repository](https://github.com/akarX23)
