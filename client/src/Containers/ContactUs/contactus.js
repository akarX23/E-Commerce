import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";

import Input from "../../WidgetsUI/InputUI/input";

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
  info: {
    color: "#697076",
    [theme.breakpoints.down(430)]: {
      fontSize: "14px",
    },
    marginBottom: "20px",
  },
});

class ContactUs extends Component {
  state = {
    problem: "",
    showAlert: false,
    alert: "",
    severity: "",
  };

  onSubmit = (event) => {
    event.preventDefault();
    if (this.state.problem === "") {
      this.setState({
        showAlert: true,
        alert: "Please state your problem.",
        severity: "error",
      });
      return;
    }
    this.setState({
      showAlert: true,
      alert: "Thank you for your Feed Back",
      severity: "success",
      problem: "",
    });
    console.log(
      "Thank you for your response. We are happy to put it in the trash. Have a good day!"
    );
  };

  handleInputChange = (value) => {
    this.setState({ problem: value });
  };

  render() {
    const { classes } = this.props;
    const { problem, showAlert, alert, severity } = this.state;

    return (
      <div className="p-3 flex flex-col items-center">
        <div className="text-4xl text-center text-darktheme-200 w-full pb-1 border-b border-darktheme-400">
          Contact Us
        </div>
        <div className="w-full mbmax:text-sm text-lg mt-1 text-center text-darktheme-600">
          You feedback will be sent to us in your name and email. We will get
          back to you as soon as possible!
        </div>
        <form
          className="w-3/5 mbmax:w-5/6 flex flex-col items-center"
          onSubmit={(event) => this.onSubmit(event)}
        >
          <Input
            label="Problem"
            typeOf="submit"
            multiline={true}
            rows={5}
            rowsMax={7}
            classes={classes}
            info="State your problem in detail so we can help you better!"
            value={problem}
            onChange={(event) => this.handleInputChange(event.target.value)}
          />
          <Button color="primary" variant="contained" type="submit">
            Submit
          </Button>
        </form>

        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={() => this.setState({ showAlert: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="filled"
            onClose={() => this.setState({ showAlert: false })}
            severity={severity}
          >
            {alert}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(ContactUs);
