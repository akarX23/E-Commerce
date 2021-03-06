import React from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { connect } from "react-redux";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Link } from "react-router-dom";
import SidenavItems from "./sidenavItems";
import { purple } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  divider: {
    backgroundColor: "#33383D",
  },
  paper: {
    background: "#202428",
    color: "white",
  },
  avatar: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    width: "50px",
    height: "50px",
    fontSize: "25px",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const SideNav = (props) => {
  const classes = useStyles();

  const sidenavHeader = () => {
    if (props.auth.user.isAuth) {
      return (
        <>
          <div className="w-full p-3 box-border py-4 mx-auto">
            <Avatar
              classes={{ root: classes.avatar }}
              src={props.auth.user.image}
            >
              {props.auth.user.name[0]}
            </Avatar>
            <div className="p-2 box-border w-full text-center">
              <Typography gutterBottom className="text-white">
                <span className="text-xl">
                  {props.auth.user.name + " " + props.auth.user.lastname}
                </span>
              </Typography>
              <Typography color="textSecondary" variant="body2">
                <span className="text-gray-500 italic">
                  {props.auth.user.email}
                </span>
              </Typography>
            </div>
          </div>
          <Divider className={classes.divider} />
        </>
      );
    } else if (!props.auth.user.isAuth) {
      return (
        <>
          <div className="text-center py-3 w-64">
            <Link
              to="/"
              className="brand text-6xl text-darktheme-500 font-extrabold font-sans"
            >
              B2mE
            </Link>
          </div>
          <Divider className={classes.divider} />
        </>
      );
    }
  };

  return (
    <div>
      <SwipeableDrawer
        open={props.showNav}
        anchor="left"
        onClose={props.toggleNav}
        transitionDuration={400}
        onOpen={props.toggleNav}
        classes={{ paper: classes.paper }}
      >
        {props.auth.user ? (
          <>
            <div className="w-auto h-auto">{sidenavHeader()}</div>
            <SidenavItems
              {...props.auth.user}
              onclose={props.toggleNav}
              toggleAuthHandler={(authHandler) =>
                props.toggleAuthHandler(authHandler)
              }
            />
          </>
        ) : null}
      </SwipeableDrawer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.user,
  };
};

export default connect(mapStateToProps)(SideNav);
