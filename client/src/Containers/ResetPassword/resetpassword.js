import React, { Component } from "react";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { resetPasswordConfirm } from "../../actions/user_actions";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import Input from "../../WidgetsUI/InputUI/input";
import Loading from "../../WidgetsUI/Loading/loading";

const styles = (theme) => ({
  textField: {
    backgroundColor: "#202428",
    borderRadius: "5px",
    width: "100%",
  },
  inputRoot: {
    color: "white",
    fontSize: "20px",
    fontFamily: "sans",
  },
  submit: {
    outline: "none !important",
    border: "none !important",
    width: "140px",
    marginTop: "20px",
  },
  info: {
    color: "#A5ACB3",
    marginTop: "2px",
    fontSize: "13px",
  },
  icon: {
    height: "100%",
    marginRight: 10,
  },
  altIcon: {
    height: "100%",
    color: "white",
    outline: "none !important",
    border: "none !important",
    marginRight: "-5px",
  },
  resetTrueIcon: {
    color: "green",
    fontSize: 50,
  },
});

class ResetPassword extends Component {
  state = {
    values: { password: "", re_enterPassword: "" },
    errors: { password: "", re_enterPassword: "" },
    type: { password: "password", re_enterPassword: "password" },
    visible: { password: false, re_enterPassword: false },
    alert: "",
    showAlert: false,
    severity: "",
    loading: false,
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.props.resetPasswordConfirm(
      this.props.queries.token,
      this.props.queries.id,
      false,
      ""
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.resetPassword) {
      let alert = "",
        showAlert = false,
        severity = "";
      if (
        nextProps.user.resetPassword.reset === false &&
        nextProps.user.resetPassword.expired === null
      ) {
        alert = "Something went wrong. PLease try again!";
        showAlert = true;
        severity = "error";
      } else if (nextProps.user.resetPassword.reset === true) {
        setTimeout(() => this.props.history.push("/"), 3000);
      }
      this.setState({ alert, showAlert, severity, loading: false });
    }
  }

  handleInputChange = (value, inputName) => {
    let newErrors = this.state.errors;
    newErrors[inputName] = this.validateInput(value, inputName);

    let newValue = this.state.values;
    newValue[inputName] = value;

    this.setState({ errors: { ...newErrors }, value: { ...newValue } });
  };

  handleBlur = (value, inputName) => {
    let newErrors = this.state.errors;
    newErrors[inputName] = this.validateInput(value, inputName);

    this.setState({ errors: { ...newErrors } });
  };

  validateInput = (value, inputName) => {
    let error = "";

    if (value === "") {
      error = "This field is required";
    } else if (value.length < 5 && inputName === "password") {
      error = "Minimum number of 5 characters.";
    } else if (
      value !== this.state.values.password &&
      inputName === "re_enterPassword"
    ) {
      error = "Passwords do not match!";
    }

    return error;
  };

  submitForm = (e) => {
    e.preventDefault();

    let newErrors = this.state.errors;
    let allValid = true;
    let error = "";

    Object.keys(this.state.errors).forEach((key) => {
      error = this.validateInput(this.state.values[key], key);
      if (error !== "") allValid = false;
      newErrors[key] = error;
    });

    this.setState({ errors: { ...newErrors } });
    if (allValid === false) {
      this.setState({
        alert: "There are errors in your form",
        showAlert: true,
        severity: "error",
      });
      return;
    }
    this.setState({ loading: true });
    this.props.resetPasswordConfirm(
      this.props.queries.token,
      this.props.queries.id,
      true,
      this.state.values.password
    );
  };

  altIconFunc = (inputName) => {
    let visibility = this.state.visible;
    visibility[inputName] = !visibility[inputName];

    let type = this.state.type;
    if (type[inputName] === "password") type[inputName] = "text";
    else type[inputName] = "password";

    this.setState({ visible: { ...visibility }, type: { ...type } });
  };

  getScreentoRender = () => {
    const { classes } = this.props;

    if (this.props.user.resetPassword) {
      if (this.props.user.resetPassword.reset === true) {
        return (
          <div className="flex flex-col items-center">
            <div className="text-3xl text-darktheme-300 mb-3">
              Your password has been successfully reset!
            </div>
            <br />
            <div>
              <CheckCircleIcon classes={{ root: classes.resetTrueIcon }} />
            </div>
          </div>
        );
      } else if (
        this.props.user.resetPassword.reset === false &&
        this.props.user.resetPassword.expired === true
      ) {
        return (
          <div className="text-2xl text-white font-medium">
            Your password reset link has expired. <br />
            <span className="lg">
              <a href="/user/forgot">Click here to request a new link.</a>
            </span>{" "}
          </div>
        );
      } else {
        return (
          <div className="w-11/12 mb:w-2/3 sm:w-1/2 h-auto text-center bg-darktheme-800 px-4 rounded-lg py-3">
            <div className="text-2xl text-white font-medium text-left">
              Enter a new password below!
            </div>
            <div className="border-b mt-2 border-darktheme-400 w-full"></div>
            <form
              onSubmit={(e) => this.submitForm(e)}
              className="flex flex-col justify-between items-center"
            >
              <Input
                typeOf={this.state.type.password}
                label="New Password"
                Icon={VpnKeyIcon}
                EndIcon={
                  this.state.visible.password === true
                    ? VisibilityIcon
                    : VisibilityOffIcon
                }
                classes={classes}
                value={this.state.values.password}
                onChange={(e) =>
                  this.handleInputChange(e.target.value, "password")
                }
                error={this.state.errors.password}
                handleBlur={() =>
                  this.handleBlur(this.state.values.password, "password")
                }
                altIconAction={() => this.altIconFunc("password")}
                altIconTooltip={
                  this.state.visible.password === true
                    ? "Hide Password"
                    : "Show password"
                }
              />
              <Input
                typeOf={this.state.type.re_enterPassword}
                label="Confirm Password"
                Icon={VpnKeyIcon}
                EndIcon={
                  this.state.visible.re_enterPassword === true
                    ? VisibilityIcon
                    : VisibilityOffIcon
                }
                classes={classes}
                value={this.state.values.re_enterPassword}
                onChange={(e) =>
                  this.handleInputChange(e.target.value, "re_enterPassword")
                }
                error={this.state.errors.re_enterPassword}
                handleBlur={() =>
                  this.handleBlur(
                    this.state.values.re_enterPassword,
                    "re_enterPassword"
                  )
                }
                altIconAction={() => this.altIconFunc("re_enterPassword")}
                altIconTooltip={
                  this.state.visible.re_enterPassword === true
                    ? "Hide Password"
                    : "Show password"
                }
              />
              <Button
                type="submit"
                classes={{ root: classes.submit }}
                color="primary"
                variant="contained"
              >
                reset
              </Button>
            </form>
          </div>
        );
      }
    } else return null;
  };

  render() {
    return (
      <>
        <div className="fixed inset-0 flex justify-center items-center">
          {this.getScreentoRender()}
        </div>

        <Snackbar
          open={this.state.showAlert}
          autoHideDuration={6000}
          onClose={() => this.setState({ showAlert: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="filled"
            onClose={() => this.setState({ showAlert: false })}
            severity={this.state.severity}
          >
            {this.state.alert}
          </Alert>
        </Snackbar>
        {this.state.loading ? <Loading /> : null}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ resetPasswordConfirm }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ResetPassword));
