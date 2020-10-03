import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import Input from "../InputUI/input";

const useStyles = makeStyles((theme) => ({
  addressDialogue: {
    backgroundColor: "#343A40",
  },
  addressSubmitControls: {
    color: "#4fd1c5",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "2px",
    outline: "none !important",
    border: "none !important",
    marginRight: "20px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.05) !important",
    },
  },
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
  icon: {
    height: "100%",
    marginRight: 5,
  },
  info: {
    color: "#A5ACB3",
    marginTop: "2px",
    fontSize: "13px",
  },
}));

const AddressEditor = ({
  onSaveAddress,
  address,
  openDialogue,
  closeDialogue,
}) => {
  const classes = useStyles();

  const [newAddress, setnewAddress] = useState(
    address ? { ...address } : { street: "", city: "", state: "", pincode: "" }
  );
  const [errors, setErrors] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("");

  const handleInputChange = (inputName, value) => {
    let newErrors = { ...errors };

    if ((inputName === "pincode" && !isNaN(value)) || inputName !== "pincode") {
      newErrors[inputName] = validateInputs(inputName, value);
      setnewAddress({ ...newAddress, [inputName]: value });
      setErrors({ ...newErrors });
    }
  };

  const handleBlur = (inputName, value) => {
    let newErrors = { ...errors };
    newErrors[inputName] = validateInputs(inputName, value);
    setErrors({ ...newErrors });
  };

  const validateInputs = (inputName, value) => {
    let error = "";

    if (value === "") error = "This field is required";
    else if (inputName === "pincode" && value.length !== 6)
      error = "Invalid pincode";

    return error;
  };

  const handleSaveAddress = () => {
    let newErrors = { ...errors };
    let allValid = true;
    let error = "";

    Object.keys(errors).forEach((key) => {
      error = validateInputs(key, newAddress[key]);
      if (error !== "") allValid = false;
      newErrors[key] = error;
    });
    setErrors({ ...newErrors });
    if (allValid === true) {
      closeDialogue();
      onSaveAddress({ ...newAddress });
      setShowAlert(true);
      setAlert("Address Updated!");
      setSeverity("success");
      if (!address)
        setnewAddress({ street: "", city: "", state: "", pincode: "" });
    } else {
      setShowAlert(true);
      setAlert("Address fields invalid");
      setSeverity("error");
    }
  };

  return (
    <>
      <Dialog
        open={openDialogue}
        onClose={() => closeDialogue()}
        classes={{ paper: classes.addressDialogue }}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogContent classes={{ root: classes.reviewDialogueContent }}>
          <div className="w-full flex flex-col -mt-10">
            <Input
              label="Street"
              classes={classes}
              value={newAddress.street}
              error={errors.street}
              onChange={(event) =>
                handleInputChange("street", event.target.value)
              }
              handleBlur={(event) => handleBlur("street", event.target.value)}
            />
            <div className="flex justify-between flex-wrap">
              <div className="mb:w-1/4 mbmax:w-2/5">
                <Input
                  label="City"
                  classes={classes}
                  value={newAddress.city}
                  error={errors.city}
                  onChange={(event) =>
                    handleInputChange("city", event.target.value)
                  }
                  handleBlur={(event) => handleBlur("city", event.target.value)}
                />
              </div>
              <div className="mb:w-1/4 mbmax:w-2/5">
                <Input
                  label="State"
                  classes={classes}
                  value={newAddress.state}
                  error={errors.state}
                  onChange={(event) =>
                    handleInputChange("state", event.target.value)
                  }
                  handleBlur={(event) =>
                    handleBlur("state", event.target.value)
                  }
                />
              </div>
              <div className="mb:w-1/4 mbmax:w-2/5">
                <Input
                  label="Pincode"
                  classes={classes}
                  value={newAddress.pincode}
                  error={errors.pincode}
                  onChange={(event) =>
                    handleInputChange("pincode", event.target.value)
                  }
                  handleBlur={(event) =>
                    handleBlur("pincode", event.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            classes={{ root: classes.addressSubmitControls }}
            onClick={() => handleSaveAddress()}
          >
            save
          </Button>
          <Button
            classes={{ root: classes.addressSubmitControls }}
            onClick={() => closeDialogue()}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showAlert}
        autoHideDuration={5000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          onClose={() => setShowAlert(false)}
          severity={severity}
        >
          {alert}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddressEditor;
