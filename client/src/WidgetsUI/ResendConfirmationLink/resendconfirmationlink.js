import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import EmailIcon from "@material-ui/icons/Email";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import Input from "../InputUI/input";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
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
    backgroundColor: "#2f855a",
    color: "white",
    "&:hover": {
      backgroundColor: "#22543d",
    },
    width: "140px",
    marginTop: "20px",
  },
  info: {
    color: "#A5ACB3",
    marginTop: "2px",
    fontSize: "13px",
  },
}));

const ResendConfirmationLink = ({ sendData }) => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const handleInputChange = (value) => {
    let newError = error;

    newError = validateInputs(value);
    setEmail(value);
    setError(newError);
  };

  const handleBlur = (value) => {
    let newError = error;
    newError = validateInputs(value);
    setError(newError);
  };

  const validateInputs = (value) => {
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

  const submitForm = (e) => {
    e.preventDefault();

    let newError = error;
    newError = validateInputs(email);

    if (newError !== "") {
      setShowError(true);
    } else {
      sendData(email);
    }
  };

  return (
    <>
      <form
        onSubmit={submitForm}
        className="flex items-center w-full justify-center flex-col"
      >
        <Input
          label="Email"
          Icon={EmailIcon}
          info="You will get the link on this email."
          classes={classes}
          placeholder="Email..."
          value={email}
          error={error}
          onChange={(event) => handleInputChange(event.target.value)}
          handleBlur={(event) => handleBlur(event.target.value)}
        />
        <Button type="submit" classes={{ root: classes.submit }}>
          resend
        </Button>
      </form>
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          onClose={() => setShowError(false)}
          severity="error"
        >
          Email is not valid!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ResendConfirmationLink;
