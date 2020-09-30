import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./header.css";
import { logout, login, signUp } from "../../actions/user_actions";
import { bindActionCreators } from "redux";
import Modal from "../../WidgetsUI/Modal/modal";
import LogInForm from "../Forms/loginForm";
import SignUpForm from "../Forms/signUpForm";
import AlertSlide from "../../WidgetsUI/Alert/alert";
import Loading from "../../WidgetsUI/Loading/loading";
import SideNav from "./SideNav/sidenav";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import { purple } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";

const styles = (theme) => ({
  menu: {
    backgroundColor: "#33383D",
    paddingLeft: "7px",
    paddingRight: "7px",
  },
  menuItem: {
    color: "#D2D8DD !important",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: "#202428",
    },
  },
  avatar: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    width: "30px",
    height: "30px",

    transition: "all 0.5s ease-in",
    [theme.breakpoints.down("xs")]: {
      width: "27px !important",
      height: "27px !important",
      fontSize: "14px",
    },
  },
});

var prevScrollPos = 0;

class Header extends Component {
  state = {
    showNav: false,
    anchorEl: null,
    showLogout: false,
    showLogIn: false,
    showSignUp: false,
    showAlert: false,
    alertItems: {
      heading: "",
      body: "",
      variant: "",
    },
    loading: false,
    options: [
      { text: "My Profile", divide: true, link: "/myprofile" },
      { text: "Delete User", link: "/user/delete" },
    ],
    showHeader: true,
  };

  componentWillMount() {
    this.header = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("scroll", () => {
      var currentScrollPos = window.pageYOffset;

      if (currentScrollPos > prevScrollPos && this.state.showHeader === true)
        this.setState({ showHeader: false });
      else if (
        (currentScrollPos < prevScrollPos || currentScrollPos === 0) &&
        this.state.showHeader === false
      )
        this.setState({ showHeader: true });
      prevScrollPos = currentScrollPos;
    });
  }

  toggleAuthHandler = (authHandler) => {
    this.state[authHandler] === true
      ? (document.body.style.overflow = "auto")
      : (document.body.style.overflow = "hidden");

    this.setState({
      [authHandler]: !this.state[authHandler],
      showAlert: false,
    });
  };

  openMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  icon = (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`ml-1 sm:ml-3 text-gray-200 w-8 h-8 cursor-pointer menu-bar`}
      onClick={() => this.setState({ showNav: true })}
    >
      <path
        fillRule="evenodd"
        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );

  rednerNavLinks = (links) => {
    return links.map((link, i) => {
      return (
        <a href={link[1]} key={i}>
          <div className="flex navlink scale-100 items-center font-bold rounded-lg bg-darktheme-800 uppercase text-xs font-serif transition-all duration-200 ease-in-out hover:-translate-y-1 transform hover:scale-110 hover:bg-darktheme-700 hover:px-8 tracking-wider px-2 py-1 mx-2 text-gray-300 hover:text-darktheme-100 box-border">
            {link[2]}
            {link[0]}
          </div>
        </a>
      );
    });
  };

  renderAuthorisedLinks = () => {
    const { classes } = this.props;
    return (
      <div className="flex items-center w-4/5 justify-between">
        <Link to="/user/cart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-gray-200 mb:w-6 mb:h-6 w-6 h-6 cursor-pointer transition-all hover:text-yellow-500 duration-300"
            viewBox="0 0 20 20"
          >
            <path d="M4 2h16l-3 9H4a1 1 0 1 0 0 2h13v2H4a3 3 0 0 1 0-6h.33L3 5 2 2H0V0h3a1 1 0 0 1 1 1v1zm1 18a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm10 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
          </svg>
        </Link>
        <div
          className="flex items-center relative cursor-pointer user"
          onClick={(event) => this.openMenu(event)}
        >
          {this.props.auth.user ? (
            <Avatar
              classes={{ root: classes.avatar }}
              src={this.props.auth.user.image}
            >
              {this.props.auth.user.name[0]}
            </Avatar>
          ) : null}
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 ml-2 h-8 text-white drop-user-icon"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <Menu
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={() => this.handleClose()}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          autoFocus={false}
          classes={{
            paper: classes.menu,
          }}
        >
          {this.state.options.map((option, i) => (
            <div key={i}>
              <MenuItem
                onClick={() => this.handleClose()}
                classes={{ root: classes.menuItem }}
                component="a"
                href={option.link}
              >
                {option.text}
              </MenuItem>
              {option.divide ? (
                <div className="w-full border-t my-2 border-gray-800"></div>
              ) : null}
            </div>
          ))}
        </Menu>
        <button
          onClick={() => this.toggleAuthHandler("showLogout")}
          className="text-gray-200 logout mbmax:hidden flex items-center p-2 rounded-lg tracking-wider font-light font-serif bg-darktheme-800 hover:bg-darktheme-400 transition-all duration-500 hover:text-black box-border"
        >
          <div className="mdmax:hidden">LOG OUT</div>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 ml-2 h-6">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  };

  renderLogIn = () => {
    return (
      <div className="flex flex-grow justify-evenly">
        <div className="mdmax:hidden border-l border-gray-500"></div>
        <button
          onClick={() => this.toggleAuthHandler("showLogIn")}
          className="text-gray-200 logout flex items-center p-2 rounded-md tracking-wider font-light font-serif bg-darktheme-800 hover:bg-darktheme-400 transition-all duration-500 hover:text-black box-border"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="login mr-2 w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <div className="mdmax:hidden">LOG IN</div>
        </button>
      </div>
    );
  };

  changeForm = () => {
    this.setState({
      showLogIn: !this.state.showLogIn,
      showSignUp: !this.state.showSignUp,
      showAlert: false,
    });
  };

  componentWillReceiveProps(nextprops) {
    if (nextprops.auth.user) {
      let authenticationDetails = nextprops.auth.user;
      let heading = "",
        body = "",
        variant = "";

      if (authenticationDetails.success === false) {
        if (authenticationDetails.verified === false) {
          heading = "FAILED!";
          variant = "warning";
          body = (
            <>
              <hr />
              You have not been verified yet. Check your mail or{" "}
              <a href="/user/requestverification">
                request for a new verification link!
              </a>
            </>
          );
        } else if (authenticationDetails.verified === true) {
          heading = "FAILED!";
          variant = "warning";
          body = (
            <>
              <hr />
              You are a registered user.{" "}
              <div
                className="cursor-pointer hover:underline inline-block font-bold"
                onClick={() => this.changeForm()}
              >
                Log In here
              </div>
            </>
          );
        } else if (
          authenticationDetails.mismatch === true ||
          authenticationDetails.emailNotFound === true
        ) {
          heading = "FAILED!";
          variant = "warning";
          body = (
            <>
              <hr />
              Email or Password incorrect. Please try again!
            </>
          );
        } else {
          heading = "OOPS!";
          variant = "danger";
          body = (
            <>
              <hr />
              Something went wrong. Please try again!
            </>
          );
        }
        let alertItems = {
          heading,
          body,
          variant,
        };
        this.setState({ showAlert: true, alertItems });
      } else if (
        authenticationDetails.isAuth === true &&
        this.state.showLogIn === true
      ) {
        this.toggleAuthHandler("showLogIn");
        this.setState({ showLogIn: false, showAlert: false });
      } else if (
        authenticationDetails.isAuth === false &&
        this.state.showSignUp === true
      ) {
        variant = "success";
        heading = "Almost done";
        body = (
          <>
            <hr />
            Click the link in your mail to complete verification!
          </>
        );

        let alertItems = {
          heading,
          body,
          variant,
        };
        this.setState({ showAlert: true, alertItems });
      }
    }
    this.setState({ loading: false });
  }

  render() {
    return (
      <>
        <header
          className={`w-full fixed flex h-auto justify-around items-center z-30 transition-all ease-in duration-300 ${
            this.state.showHeader === false ? "headerHide" : "headerShow"
          }`}
        >
          {this.icon}
          <SideNav
            showNav={this.state.showNav}
            toggleNav={() => this.setState({ showNav: !this.state.showNav })}
            toggleAuthHandler={(authHandler) =>
              this.toggleAuthHandler(authHandler)
            }
          />
          <a
            href="/"
            className="brand text-4xl text-darktheme-500 font-extrabold font-sans transition duration-200 ease-out transform hover:scale-125"
          >
            B2mE
          </a>
          <div className={`flex items-center mdmax:hidden`}>
            {this.rednerNavLinks([
              [
                "Home",
                "/",
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 mr-1"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>,
              ],
              [
                "About Us",
                "/about",
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  ></path>
                </svg>,
              ],
              [
                "Contact Us",
                "/contact",
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  ></path>
                </svg>,
              ],
            ])}
          </div>
          <div className="user-links w-1/3 flex justify-end">
            {this.props.auth.user
              ? this.props.auth.user.isAuth
                ? this.renderAuthorisedLinks()
                : this.renderLogIn()
              : null}
          </div>
        </header>
        <Modal
          title="Log Out"
          showModal={this.state.showLogout}
          hideModal={() => this.toggleAuthHandler("showLogout")}
        >
          <div className="font-serif font-semibold text-xl text-darktheme-200 mb-20">
            Are you sure you want to log out?
          </div>
          <button
            className="rounded-md logout text-xl font-serif text-center font-bold text-white bg-darktheme-900 transition-all hover:bg-red-500 duration-500"
            onClick={() => {
              this.setState({ loading: true });
              this.props.logout();
              this.toggleAuthHandler("showLogout");
            }}
          >
            <div className="hover:text-black py-2 px-4 transition-all duration-500">
              Yes
            </div>
          </button>
          <button
            className="rounded-md ml-4 inline-block logout font-bold relative text-xl font-serif text-center text-white bg-darktheme-900 transition-all hover:text-black hover:bg-green-400 duration-500"
            onClick={() => this.toggleAuthHandler("showLogout")}
          >
            <div className="hover:text-black transition-all duration-500 py-2 px-4">
              No
            </div>
          </button>
        </Modal>
        <Modal
          title="Log In"
          showModal={this.state.showLogIn}
          hideModal={() => this.toggleAuthHandler("showLogIn")}
        >
          <LogInForm
            login={(data) => {
              this.setState({ loading: true });
              this.props.login(data);
            }}
            changeForm={() => this.changeForm()}
            hideModal={() => this.toggleAuthHandler("showLogIn")}
          />
        </Modal>
        <Modal
          title="Sign Up"
          showModal={this.state.showSignUp}
          hideModal={() => {
            this.toggleAuthHandler("showSignUp");
          }}
        >
          <SignUpForm
            signup={(data) => {
              this.setState({ loading: true });
              this.props.signUp(data);
            }}
            changeForm={() => this.changeForm()}
          />
        </Modal>
        <AlertSlide
          showAlert={this.state.showAlert}
          {...this.state.alertItems}
          onclose={() => this.setState({ showAlert: false })}
        />
        {this.state.loading === true ? <Loading /> : null}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ logout, login, signUp }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Header));
