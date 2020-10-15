import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import StoreSharpIcon from "@material-ui/icons/StoreSharp";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AddIcon from "@material-ui/icons/Add";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";

const useStyles = makeStyles((theme) => ({
  divider: {
    backgroundColor: "#33383D",
  },
  listitem: {
    color: "#fffffb !important",
    "&:hover": {
      backgroundColor: "#33383D",
    },
  },
}));

const SidenavItems = ({ isAuth, role, ...rest }) => {
  const classes = useStyles();

  const generateItem = (text, link = null, icon, authHandler = null) => {
    return {
      text,
      link,
      icon,
      authHandler,
    };
  };

  const authList = [
    [
      generateItem("Home", "/", <HomeIcon style={{ fill: "#fff" }} />),
      generateItem(
        "My Profile",
        "/user/myprofile",
        <AccountBoxIcon style={{ fill: "#fff" }} />
      ),
      generateItem(
        "My Cart",
        "/user/mycart",
        <ShoppingCartIcon style={{ fill: "#fff" }} />
      ),
      generateItem(
        "My Orders",
        "/user/myorders",
        <LocalMallIcon style={{ fill: "#fff" }} />
      ),
    ],
    [
      generateItem(
        "My Products",
        "/user/myproducts",
        <StoreSharpIcon style={{ fill: "#fff" }} />
      ),
      generateItem(
        "Add Product",
        "/user/addproduct",
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="view-grid-add text-white w-6 h-6"
        >
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
        </svg>
      ),
    ],
    [
      generateItem(
        "Log Out",
        null,
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="logout text-white w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
            clipRule="evenodd"
          />
        </svg>,
        "showLogout"
      ),
      generateItem("About Us", "/about", <InfoIcon style={{ fill: "#fff" }} />),
      generateItem(
        "Contact Us",
        "/contact",
        <ContactSupportIcon style={{ fill: "#fff" }} />
      ),
    ],
  ];

  const authAdminList = [
    [
      generateItem("Home", "/", <HomeIcon style={{ fill: "#fff" }} />),
      generateItem(
        "My Profile",
        "/user/myprofile",
        <AccountBoxIcon style={{ fill: "#fff" }} />
      ),
      generateItem(
        "My Cart",
        "/user/mycart",
        <ShoppingCartIcon style={{ fill: "#fff" }} />
      ),
      generateItem(
        "My Orders",
        "/user/myorders",
        <LocalMallIcon style={{ fill: "#fff" }} />
      ),
    ],
    [
      generateItem(
        "My Products",
        "/user/myproducts",
        <StoreSharpIcon style={{ fill: "#fff" }} />
      ),
      generateItem(
        "Add Product",
        "/user/addproduct",
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="view-grid-add text-white w-6 h-6"
        >
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
        </svg>
      ),
    ],
    [
      generateItem(
        "Admin Panel",
        "/admin",
        <SupervisorAccountIcon style={{ fill: "#fff" }} />
      ),
    ],
    [
      generateItem(
        "Log Out",
        null,
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="logout text-white w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
            clipRule="evenodd"
          />
        </svg>,

        "showLogout"
      ),
      generateItem("About Us", "/about", <InfoIcon style={{ fill: "#fff" }} />),
      generateItem(
        "Contact Us",
        "/contact",
        <ContactSupportIcon style={{ fill: "#fff" }} />
      ),
    ],
  ];

  const unAuthList = [
    [
      generateItem("Home", "/", <HomeIcon style={{ fill: "#fff" }} />),
      generateItem(
        "Log In",
        null,
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="login text-white w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>,

        "showLogIn"
      ),
      generateItem(
        "Sign Up",
        null,
        <AddIcon style={{ fill: "#fff" }} />,
        "showSignUp"
      ),
    ],
    [
      generateItem("About Us", "/about", <InfoIcon style={{ fill: "#fff" }} />),
      generateItem(
        "Contact Us",
        "/contact",
        <ContactSupportIcon style={{ fill: "#fff" }} />
      ),
    ],
  ];

  const getListItems = () => {
    if (isAuth && role === 0) return authList;
    else if (isAuth && role === 1) return authAdminList;
    else return unAuthList;
  };

  const element = (item, i) => {
    return (
      <div key={i}>
        <ListItem
          button
          component="a"
          href={item.link}
          className={classes.listitem}
          onClick={() => {
            rest.onclose();
            rest.toggleAuthHandler(item.authHandler);
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      </div>
    );
  };

  return (
    <div className="w-full h-auto box-border overscroll-contain custom-scrollbar overflow-auto scrolling-touch">
      {getListItems().map((item, index) => (
        <div key={index}>
          <List>
            {item.map((listitem, index) => {
              return element(listitem, index);
            })}
          </List>
          {index < getListItems().length - 1 ? (
            <Divider className={classes.divider} />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default SidenavItems;
