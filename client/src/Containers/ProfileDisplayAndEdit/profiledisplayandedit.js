import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { getProfileDetails, updateUser } from "../../actions/user_actions";
import { bindActionCreators } from "redux";
import Input from "../../WidgetsUI/InputUI/input";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import SaveIcon from "@material-ui/icons/Save";
import NavigationPrompt from "react-router-navigation-prompt";

import Loading from "../../WidgetsUI/Loading/loading";
import UserImageUpload from "../../WidgetsUI/UserImageUpload/userimageupload";
import UploadImageCard from "../../WidgetsUI/UploadImageCard/uploadimagecard";
import ViewFullImage from "../../WidgetsUI/ViewFullImage/viewfullimage";
import Address from "../../WidgetsUI/Address/address";
import AdressEditor from "../../WidgetsUI/AdressEditor/addresseditor";
import PageNotFound from "../../WidgetsUI/PageNotFound/pageNotFound";

import userImg from "../../assets/user_img.png";

const styles = (theme) => ({
  imageContainer: {
    width: "50%",
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
  reset: {
    color: "white !important",
    width: "170px",
    outline: "none !important",
    border: "none !important",
    marginTop: "10px",
    selfAligh: "start",
  },
  addAddress: {
    color: "#4fd1c5",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "2px",
    outline: "none !important",
    border: "none !important",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.05) !important",
    },
  },
  image: {
    width: "100%",
    maxWidth: "400px",
    [theme.breakpoints.down(450)]: {
      maxWidth: "300px",
    },
  },
  addressWide: {
    [theme.breakpoints.down(640)]: {
      display: "none",
    },
    [theme.breakpoints.up(640)]: {
      display: "flex",
      flexDirection: "column",
      width: "90%",
    },
  },
  addressMobile: {
    [theme.breakpoints.up(640)]: {
      display: "none",
    },
    [theme.breakpoints.down(640)]: {
      display: "flex",
      flexDirection: "column",
      width: "85%",
    },
  },
  saveButton: {
    color: "white !important",
    width: "auto",
    outline: "none !important",
    border: "none !important",
    backgroundColor: "#48bb78 !important",
    [theme.breakpoints.down(640)]: {
      display: "none",
    },
  },
  saveButtonMobile: {
    color: "white !important",
    width: "auto",
    fontSize: "15px",
    outline: "none !important",
    border: "none !important",
    backgroundColor: "#48bb78 !important",
    [theme.breakpoints.up(640)]: {
      display: "none",
    },
  },
});

class ProfileDisplayAndEdit extends Component {
  state = {
    loading: false,
    file: null,
    image: null,
    changed: false,
    values: {
      name: "",
      lastname: "",
      email: "",
      mobile: "",
      address: [],
      image: null,
    },
    errors: {
      name: "",
      lastname: "",
      mobile: "",
    },
    fullImage: false,
    alert: "",
    showAlert: false,
    severity: "",
    addAddress: false,
  };

  componentWillMount() {
    this.setState({
      values: { ...this.props.user.user },
      image: this.props.user.user.image,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.user.isAuth) {
      let user = nextProps.user.user;
      let alert = "",
        showAlert = false,
        severity = "",
        changed = this.state.changed;

      if (nextProps.user.update && nextProps.user.update === true) {
        user = { ...nextProps.user.user };
        alert = "Profile Updated!";
        showAlert = true;
        severity = "success";
        changed = false;
      } else if (nextProps.user.update && nextProps.user.update === false) {
        alert = "Something went wrong. Please try again.";
        showAlert = true;
        severity = "error";
      }

      this.setState({
        loading: false,
        image: user.image,
        values: {
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          address: [...user.address],
          mobile: user.mobile,
          imageURL: user.image,
        },
        alert,
        showAlert,
        severity,
        changed,
      });
    }
  }

  handleDeleteImage = () => {
    this.setState({ image: null, file: null, changed: true });
  };

  handleInputChange = (inputName, value) => {
    let newErrors = { ...this.state.errors };

    if (
      (inputName === "mobile" && !isNaN(value) && value === value.trim()) ||
      inputName !== "mobile"
    ) {
      newErrors[inputName] = this.validateInputs(inputName, value);
      this.setState({
        values: { ...this.state.values, [inputName]: value },
        errors: { ...newErrors },
        changed: true,
      });
    }
  };

  handleBlur = (inputName, value) => {
    let newErrors = { ...this.state.errors };
    newErrors[inputName] = this.validateInputs(inputName, value);
    this.setState({
      errors: { ...newErrors },
      values: {
        ...this.state.values,
        [inputName]: value.trim(),
      },
    });
  };

  validateInputs = (inputName, value) => {
    let error = "";

    if (value === "") error = "This field is required";
    else if (inputName === "mobile" && (isNaN(value) || value.length !== 10))
      error = "Invalid Value";

    return error;
  };

  handleDeleteAddress = (i) => {
    let addresses = [...this.state.values.address];
    addresses = addresses.filter((address, index) => index !== i);

    this.setState({
      values: { ...this.state.values, address: [...addresses] },
      showAlert: true,
      alert: "Address Deleted",
      severity: "success",
      changed: true,
    });
  };

  handleSaveAddress = (address, i, newEntry) => {
    let newAddress = [...this.state.values.address];

    if (newEntry === true) newAddress.push({ ...address });
    else newAddress[i] = { ...address };

    this.setState({
      values: { ...this.state.values, address: [...newAddress] },
      changed: true,
    });
  };

  renderAddressComponent = () => {
    const { classes } = this.props;
    const { values } = this.state;
    return (
      <>
        <div className="w-full border-b border-darktheme-200 pb-1 flex justify-between mt-4">
          <div className="text-lg font-sans text-darktheme-200">
            Your Addresses
          </div>
          <Button
            color="primary"
            classes={{ root: classes.addAddress }}
            onClick={() => this.setState({ addAddress: true })}
            startIcon={
              <AddCircleOutlineIcon style={{ fontSize: 17, fontWeight: 700 }} />
            }
          >
            add address
          </Button>
        </div>
        {values.address.length > 0 ? (
          <div className="smmax:h-auto sm:h-56 overflow-auto">
            {values.address.map((address, i) => {
              return (
                <Address
                  key={i}
                  details={address}
                  onDelete={() => this.handleDeleteAddress(i)}
                  onSaveAddress={(address) => {
                    this.handleSaveAddress(address, i);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="mt-2">
            <PageNotFound message="You have no saved addresses!" />
          </div>
        )}
      </>
    );
  };

  sendUserDetails = () => {
    let newErrors = { ...this.state.errors };
    let allValid = true;
    let error = "";

    Object.keys(this.state.errors).forEach((key) => {
      error = this.validateInputs(key, this.state.values[key]);
      if (error !== "") allValid = false;
      newErrors[key] = error;
    });

    if (allValid === true) {
      if (this.state.changed === true) {
        this.setState({ loading: true, errors: { ...newErrors } });
        this.props.updateUser(this.state.values, this.state.image);
      } else
        this.setState({
          alert: "Profile Updated!",
          showAlert: true,
          severity: "success",
          errors: { ...newErrors },
        });
    } else
      this.setState({
        alert: "Fields have error in them.",
        showAlert: true,
        severity: "error",
        errors: { ...newErrors },
      });
  };

  renderImageComponent = () => {
    const { classes } = this.props;

    return (
      <div
        className={`mb:m-3 sm:w-1/2 w-full mb:mb-0 flex items-start justify-center`}
      >
        <div className="flex w-full flex-col items-center">
          <div className="w-full text-center mb-3">
            <Button
              variant="contained"
              classes={{ root: classes.saveButtonMobile }}
              startIcon={<SaveIcon />}
              onClick={() => this.sendUserDetails()}
            >
              Save profile
            </Button>
          </div>
          <div className={classes.image}>
            <UploadImageCard
              file={null}
              image={this.state.image ? this.state.image : userImg}
              readonly={this.state.image ? false : true}
              deleteImage={() => this.handleDeleteImage()}
            />
          </div>
          <div className="mt-3 flex items-start w-full justify-evenly">
            <UserImageUpload
              image={this.state.image}
              file={null}
              onChangeImage={(image) => this.setState({ image, changed: true })}
            />

            <ViewFullImage
              closeImage={() => this.setState({ fullImage: false })}
              image={this.state.image}
              openState={this.state.fullImage}
              open={() => this.setState({ fullImage: true })}
            />
          </div>
          <div className={classes.addressWide}>
            {this.renderAddressComponent()}
          </div>
        </div>
      </div>
    );
  };

  renderDetailsComponent = () => {
    const { classes } = this.props;
    const { values, errors } = this.state;

    return (
      <div className="-mt-5 sm:w-1/2 w-full items-start sm:ml-8 justify-center flex">
        <div className="w-4/5 flex flex-col">
          <Input
            label="Name"
            classes={classes}
            value={values.name}
            error={errors.name}
            onChange={(event) =>
              this.handleInputChange("name", event.target.value)
            }
            handleBlur={(event) => this.handleBlur("name", event.target.value)}
            Icon={PersonIcon}
          />
          <Input
            label="Last Name"
            classes={classes}
            value={values.lastname}
            error={errors.lastname}
            onChange={(event) =>
              this.handleInputChange("lastname", event.target.value)
            }
            handleBlur={(event) =>
              this.handleBlur("lastname", event.target.value)
            }
            Icon={PersonIcon}
          />
          <Input
            label="Mobile"
            classes={classes}
            value={values.mobile}
            error={errors.mobile}
            onChange={(event) =>
              this.handleInputChange("mobile", event.target.value)
            }
            handleBlur={(event) =>
              this.handleBlur("mobile", event.target.value)
            }
            Icon={PhoneIcon}
          />
          <Input
            label="Email"
            readonly={true}
            classes={classes}
            value={values.email}
            error={errors.email}
            onChange={(event) =>
              this.handleInputChange("email", event.target.value)
            }
            handleBlur={(event) => this.handleBlur("email", event.target.value)}
            Icon={EmailIcon}
          />
          <Button
            color="secondary"
            variant="contained"
            classes={{ root: classes.reset }}
            href="/user/forgot"
          >
            reset password
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <div className="sm:p-4 pb-0 w-full flex flex-col items-center justify-start box-border">
          <div className="text-xl w-full flex text-darktheme-100 smmax:justify-center sm:justify-between border-b border-darktheme-600 py-2 mb-3">
            <div> Here you can view and edit your profile!</div>
            <Button
              variant="contained"
              classes={{ root: classes.saveButton }}
              startIcon={<SaveIcon />}
              onClick={() => this.sendUserDetails()}
            >
              Save profile
            </Button>
          </div>
          <div className="w-full flex flex-col items-center sm:flex-row sm:justify-center sm:items-start">
            {this.renderImageComponent()}
            {this.renderDetailsComponent()}
            <div className={classes.addressMobile}>
              {this.renderAddressComponent()}
            </div>
          </div>
        </div>
        {this.state.loading === true ? <Loading /> : null}
        <Snackbar
          open={this.state.showAlert === true}
          autoHideDuration={6000}
          onClose={() => {
            this.setState({ showAlert: false });
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="filled"
            onClose={() => {
              this.setState({ showAlert: false });
            }}
            severity={this.state.severity}
          >
            {this.state.alert}
          </Alert>
        </Snackbar>
        <AdressEditor
          openDialogue={this.state.addAddress}
          closeDialogue={() => this.setState({ addAddress: false })}
          onSaveAddress={(address) => this.handleSaveAddress(address, 0, true)}
        />
        {/* <NavigationPrompt when={this.state.changed}></NavigationPrompt> */}
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
  ...bindActionCreators({ getProfileDetails, updateUser }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ProfileDisplayAndEdit));
