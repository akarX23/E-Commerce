import React, { Component } from "react";
import { connect } from "react-redux";
import {
  confirmMail,
  resendEmail,
  updateUser,
  clearVerify,
} from "../../actions/user_actions";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import WarningIcon from "@material-ui/icons/Warning";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import SkipNextIcon from "@material-ui/icons/SkipNext";

import Loading from "../../WidgetsUI/Loading/loading";
import ResendConfirmationLink from "../../WidgetsUI/ResendConfirmationLink/resendconfirmationlink";
import UserImageUpload from "../../WidgetsUI/UserImageUpload/userimageupload";
import UploadImageCard from "../../WidgetsUI/UploadImageCard/uploadimagecard";

const styles = (theme) => ({
  icon: {
    color: "green",
    fontSize: 100,
  },
  warning: {
    color: "#faf089",
    fontSize: "2.25rem",
  },
  response: {
    outline: "none !important",
    border: "none !important",
    width: "150px",
    [theme.breakpoints.up(420)]: {
      marginTop: "30px",
    },
    [theme.breakpoints.down(420)]: {
      marginLeft: "20px",
    },
    backgroundColor: "#48bb78",
    "&:hover": {
      backgroundColor: "#2f855a",
    },
    color: "white",
  },
});

class EmailConfirmation extends Component {
  state = {
    loading: true,
    severity: "",
    alert: "",
    showAlert: false,
    file: null,
    image: null,
  };

  componentWillMount() {
    this.props.confirmMail(this.props.queries.token, this.props.queries.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.verification) {
      let alert = "",
        severity = "",
        showAlert = false;
      if (nextProps.user.verification.linksent === false) {
        showAlert = true;
        if (nextProps.user.verification.userFound === false) {
          alert = "Could not find this user";
          severity = "error";
        } else if (nextProps.user.verification.linkVerified === true) {
          alert = "This user has already been verified";
          severity = "warning";
        } else {
          alert = "Somethign went wrong. Please try again!";
          severity = "error";
        }
      } else if (nextProps.user.verification.linksent === true) {
        showAlert = true;
        alert = "A new link has been sent to this email address.";
        severity = "success";
      } else if (nextProps.user.update === true) {
        alert = "Profile picture updated! Redirecting you...";
        severity = "success";
        showAlert = true;
        setTimeout(() => this.props.history.push("/"), 4000);
      } else if (nextProps.user.update === false) {
        alert = "Something went wrong!";
        severity = "error";
        showAlert = true;
      }
      this.setState({ loading: false, alert, severity, showAlert });
    }
  }

  componentWillUnmount() {
    this.props.clearVerify();
  }

  sendResendMail = (email) => {
    this.setState({ loading: true });
    this.props.resendEmail(email);
  };

  saveProfilePic = () => {
    this.setState({ loading: true });
    this.props.updateUser({}, this.state.image);
  };

  handleDeleteImage = () => {
    this.setState({ image: null, file: null });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className="p-3 pl-4 text-center">
        {this.props.user.verification ? (
          this.props.user.verification.verified === true ? (
            this.props.user.verification.new === true ? (
              <>
                <div className="text-2xl ml-2 font-semibold sm:text-3xl md:text-4xl my-4 text-darktheme-400">
                  Hello Ritik ,
                </div>
                <div className="text-lg text-darktheme-300 font-sans">
                  Your account has been verified. Thank you for joining B2ME!
                  Hope you have a great experience!
                </div>
                <div className="w-full text-center mt-2">
                  <HowToRegIcon classes={{ root: classes.icon }} />
                </div>
                <div className="mt-3 text-lg text-darktheme-400">
                  As a last step to complete your profile you can add a profile
                  pic. You can always add or edit it later.
                </div>
                <div className="flex flex-col mb:justify-center mb:flex-row mt-4 items-start">
                  <div className="flex mbmax:mx-auto mb:flex-col mbmax:flex-row items-start">
                    <UserImageUpload
                      image={this.state.image}
                      file={this.state.file}
                      onChangeImage={(image, file) =>
                        this.setState({ image, file })
                      }
                    />
                    {this.state.image ? (
                      <Button
                        variant="contained"
                        classes={{ root: classes.response }}
                        startIcon={<SaveIcon fontSize="large" />}
                        onClick={() => this.saveProfilePic()}
                      >
                        save
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        classes={{ root: classes.response }}
                        endIcon={<SkipNextIcon fontSize="large" />}
                        onClick={() => this.props.history.push("/")}
                      >
                        skip
                      </Button>
                    )}
                  </div>
                  {this.state.image && (
                    <div className="w-64 mbmax:mx-auto mb:mr-0 mb:ml-6 mb:mt-0 mbmax:mt-4">
                      <UploadImageCard
                        file={this.state.file}
                        image={this.state.image}
                        deleteImage={() => this.handleDeleteImage()}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl ml-2 font-semibold sm:text-3xl md:text-4xl my-4 text-darktheme-400">
                  Hello Ritik ,
                </div>
                <div className="text-lg text-darktheme-300 font-sans">
                  Your account has already been verified. Please Log In.
                </div>
                <div className="w-full text-center mt-2">
                  <HowToRegIcon classes={{ root: classes.icon }} />
                </div>
              </>
            )
          ) : (
            <>
              <div className="flex my-4 items-center">
                <WarningIcon classes={{ root: classes.warning }} />
                <div className="font-semibold ml-2 text-4xl text-yellow-300">
                  OOPS!
                </div>
              </div>
              <div className="text-2xl text-darktheme-300 font-sans">
                It seems like your verification link has expired!
              </div>
              <div className="text-green-500 font-mono mt-2">
                You can request a new verification link below.
              </div>
              <div className="w-4/5 sm:w-3/5 text-center mx-auto">
                <ResendConfirmationLink
                  sendData={(email) => this.sendResendMail(email)}
                />
              </div>
            </>
          )
        ) : null}
        {this.state.loading === true && <Loading />}
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    { confirmMail, resendEmail, updateUser, clearVerify },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(EmailConfirmation));
