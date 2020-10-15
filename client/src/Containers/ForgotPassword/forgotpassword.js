import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { resetPasswordLink } from "../../actions/user_actions";
import { bindActionCreators } from "redux";
import EmailIcon from "@material-ui/icons/Email";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

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
    fontSize: "17px",
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
    marginRight: 10,
  },
});

class ForgotPassword extends Component {
  state = {
    loading: false,
    email: "",
    error: "",
    alert: "",
    showAlert: false,
    severity: "",
  };

  componentDidMount() {
    if (this.props.user.user.isAuth === true)
      this.setState({ email: this.props.user.user.email });
  }

  handleInputChange = (value) => {
    let newError = this.state.error;

    newError = this.validateInputs(value);
    this.setState({ email: value, error: newError });
  };

  handleBlur = (value) => {
    let newError = this.state.error;
    newError = this.validateInputs(value);
    this.setState({ error: newError });
  };

  validateInputs = (value) => {
    let error = "";

    if (value === "") {
      error = "This field is required";
    } else if (
      !RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ).test(value)
    ) {
      error = "Email not valid";
    }

    return error;
  };

  submitForm = (e) => {
    e.preventDefault();

    let newError = this.state.error;
    newError = this.validateInputs(this.state.email);

    if (newError !== "") {
      this.setState({
        error: newError,
        showAlert: true,
        alert: "Email not valid!",
        severity: "error",
      });
    } else {
      this.setState({ loading: true });

      this.props.resetPasswordLink(this.state.email, this.props.user.user.id);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.resetPasswordLink) {
      let showAlert = false,
        alert = "",
        severity = "";
      if (nextProps.user.resetPasswordLink.linksent === true) {
        showAlert = true;
        alert = "Link sent successfully!";
        severity = "success";
      } else if (nextProps.user.resetPasswordLink.userFound === false) {
        showAlert = true;
        alert = "This email address isn't linked to any account!";
        severity = "warning";
      }
      this.setState({ alert, showAlert, severity, loading: false });
    }
  }

  render() {
    const { classes } = this.props;
    const { email, error } = this.state;

    return (
      <>
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="w-4/5 mb:w-2/3 sm:w-1/2 h-auto text-center bg-darktheme-800 px-4 rounded-lg py-3">
            <div className="text-lg text-darktheme-300 text-left">
              Enter your email below. Click the link you receive in your mail to
              reset your password.
            </div>
            <div className="border-b mt-2 border-darktheme-400 w-full"></div>
            <form
              onSubmit={(e) => this.submitForm(e)}
              className="flex flex-col justify-between items-center"
            >
              <Input
                label="Email"
                Icon={EmailIcon}
                info="You will get the link on this email."
                classes={classes}
                placeholder="Email..."
                value={email}
                error={error}
                onChange={(event) => this.handleInputChange(event.target.value)}
                handleBlur={(event) => this.handleBlur(event.target.value)}
              />
              <Button
                type="submit"
                classes={{ root: classes.submit }}
                color="primary"
                variant="contained"
              >
                send
              </Button>
            </form>
          </div>
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
  ...bindActionCreators({ resetPasswordLink }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ForgotPassword));
