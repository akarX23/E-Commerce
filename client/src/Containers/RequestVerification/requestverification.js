import React, { Component } from "react";
import { connect } from "react-redux";
import { resendEmail } from "../../actions/user_actions";
import { bindActionCreators } from "redux";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import ResendConfirmationLink from "../../WidgetsUI/ResendConfirmationLink/resendconfirmationlink";
import Loading from "../../WidgetsUI/Loading/loading";

class RequestVerification extends Component {
  state = { loading: false, severity: "", alert: "", showAlert: false };

  sendResendMail = (email) => {
    this.setState({ loading: true });
    this.props.resendEmail(email);
  };

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
      }
      this.setState({ loading: false, alert, severity, showAlert });
    }
  }

  render() {
    return (
      <div className="text-center w-full px-4 mt-3">
        <div className="my-3 text-lg mb:text-xl sm:text-2xl text-darktheme-100">
          You can enter your email here to receive the verification link for
          your account.
        </div>
        <div className="w-4/5 sm:w-3/5 text-center mx-auto">
          <ResendConfirmationLink
            sendData={(email) => this.sendResendMail(email)}
          />
        </div>
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
  ...bindActionCreators({ resendEmail }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestVerification);
