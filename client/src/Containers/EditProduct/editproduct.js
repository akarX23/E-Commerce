import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { getProductDetails, editProduct } from "../../actions/product_actions";
import { bindActionCreators } from "redux";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import AttachMoneyRoundedIcon from "@material-ui/icons/AttachMoneyRounded";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import BackupIcon from "@material-ui/icons/Backup";
import NavigationPrompt from "react-router-navigation-prompt";

import Input from "../../WidgetsUI/InputUI/input";
import Loading from "../../WidgetsUI/Loading/loading";
import DragAndDrop from "../../WidgetsUI/DragAndDrop/draganddrop";
import UploadImageCard from "../../WidgetsUI/UploadImageCard/uploadimagecard";
import PageNotFound from "../../WidgetsUI/PageNotFound/pageNotFound";

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
  icon: {
    marginLeft: "-10px",
    height: "100%",
    marginRight: 2,
  },
  info: {
    color: "#A5ACB3",
    marginTop: "2px",
    fontSize: "13px",
  },
  chipInput: {
    color: "white",
  },
  chip: {
    color: "#faf5ff",
    backgroundColor: "#454B51",
    "&:hover": {
      backgroundColor: "#202428",
    },
    marginRight: "10px",
    boxShadow: "0 0 1px 1px #697076",
    marginBottom: "10px",
  },
  saveDetails: {
    outline: "none !important",
    border: "none !important",
    marginRight: "10px",
    marginLeft: "10px",
    [theme.breakpoints.down(450)]: {
      fontSize: "11px",
    },
  },
  input: {
    display: "none",
  },
  upload: {
    backgroundColor: "#33383D !important",
    color: "#DDE1E6",
    font: "sans",
    marginRight: "10px",
  },
  dragaAndDropContainer: {
    width: "100%",
    height: "600px",
    paddingLeft: "3px",
    paddingRight: "3px",
  },
});

const types = ["image/png", "image/jpeg", "image/gif"];

class EditProduct extends Component {
  state = {
    loading: false,
    values: {
      title: "",
      description: "",
      quantity: "",
      price: "",
      tags: [],
    },
    errors: {
      title: "",
      description: "",
      quantity: "",
      price: "",
      tags: "",
    },
    showAlert: false,
    alert: "",
    severity: "",
    changed: false,
    images: [],
    files: [],
    imageRendering: false,
  };

  componentWillMount() {
    this.setState({ loading: true });
    this.props.getProductDetails(this.props.queries.id);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.product.product) {
      if (nextProps.product.product.found === false) return;
      const { product, edited } = nextProps.product.product;
      let showAlert = false,
        alert = "",
        severity = "";

      if (edited === false) {
        showAlert = true;
        alert = "Somethig went wrong";
        severity = "error";
        this.setState({ showAlert, alert, severity, loading: false });
        return;
      } else if (edited === true) {
        showAlert = true;
        alert = "Edit Successful!";
        severity = "success";
        this.setState({
          showAlert,
          alert,
          severity,
          loading: false,
          changed: false,
        });
        return;
      } else {
        let values = {
          title: product.title,
          description: product.description,
          quantity: product.quantity,
          price: product.price,
          tags: [...product.tags],
        };
        let files = product.imageURLs.map(() => null);

        this.setState({
          values,
          images: [...product.imageURLs],
          files,
          loading: false,
          showAlert: false,
        });
      }
    }
  }

  validateInputs = (inputName, value) => {
    let error = "";

    if (
      (inputName === "quantity" || inputName === "price") &&
      (value <= 0 || isNaN(value))
    )
      error = "Invalid Value";
    else if (inputName === "tags" && value.length === 0)
      error = "Atleast one tag is required";
    else if (value === "") error = "This field is required";

    return error;
  };

  handleInputChange = (inputName, value) => {
    let newErrors = { ...this.state.errors };

    if (
      (inputName === "quantity" &&
        value.toString()[value.toString().length - 1] !== "." &&
        isNaN(value) === false) ||
      (inputName === "price" && isNaN(value) === false) ||
      (inputName !== "quantity" && inputName !== "price")
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
    });
  };

  handleAddChip = (chip) => {
    let tags = [...this.state.values.tags];
    tags.push(chip);
    this.setState({
      values: { ...this.state.values, tags: [...tags] },
      errors: { ...this.state.errors, tags: this.validateInputs("tags", tags) },
      changed: true,
    });
  };

  handleDeleteChip = (chip, index) => {
    let tags = [...this.state.values.tags];
    tags = tags.filter((tag) => tag !== chip);
    this.setState({
      values: { ...this.state.values, tags: [...tags] },
      errors: { ...this.state.errors, tags: this.validateInputs("tags", tags) },
      changed: true,
    });
  };

  getFileData = (newFiles) => {
    const { files, images } = this.state;

    let imagePreviews = [],
      showAlert = false,
      alert = "",
      severity = "error";
    newFiles = newFiles.filter((file, i) => {
      if (types.includes(file.type) === false) {
        alert = "Invalid file type discarded.";
        showAlert = true;
        return false;
      }
      return true;
    });

    if (files.length + newFiles.length > 12) {
      alert = "Maximum 12 images allowed.";
      showAlert = true;
      newFiles = newFiles.slice(0, 12 - files.length);
    }

    newFiles.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.push(reader.result);
      };
      reader.onloadstart = () => {
        this.setState({ alert, showAlert, severity, imageRendering: true });
      };
      reader.onloadend = () => {
        if (i === newFiles.length - 1) {
          this.setState({
            images: [...images, ...imagePreviews],
            files: [...files, ...newFiles],
            imageRendering: false,
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  onChange = (e) => {
    const files = Array.from(e.target.files);
    try {
      this.getFileData(files);
    } catch (error) {
      console.log(error);
    }
  };

  getDraggedFiles = (files) => {
    this.getFileData(files);
  };

  handleDeleteImage = (index) => {
    const { files, images } = this.state;

    let newFiles = [...files];
    let newImages = [...images];

    newFiles = newFiles.filter((file, i) => i !== index);
    newImages = newImages.filter((image, i) => i !== index);

    this.setState({ files: [...newFiles], images: [...newImages] });
  };

  saveProfileChanges = () => {
    const { values, errors, images } = this.state;
    let newErrors = { ...errors };
    let allValid = true;
    let error = "";

    Object.keys(errors).forEach((key) => {
      error = this.validateInputs(key, values[key]);
      if (error !== "") allValid = false;
      newErrors[key] = error;
    });
    if (allValid === false) {
      this.setState({
        errors: { ...newErrors },
        alert: "Fields are not valid.",
        showAlert: true,
        severity: "error",
      });
      return;
    }

    if (images.length === 0) {
      this.setState({
        errors: { ...newErrors },
        alert: "At least one images needs to be uploaded.",
        showAlert: true,
        severity: "error",
      });
      return;
    }
    this.setState({ loading: true });
    this.props.editProduct(values, images, this.props.queries.id);
  };

  resetProfileDetails = () => {
    const { product } = this.props.product.product;

    let values = {
      title: product.title,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      tags: [...product.tags],
    };
    let files = product.imageURLs.map(() => null);

    this.setState({
      values,
      images: [...product.imageURLs],
      files,
      loading: false,
      showAlert: false,
      changed: false,
    });
  };

  render() {
    const { classes, user, product } = this.props;
    const { values, errors, images, imageRendering } = this.state;

    if (
      product.product?.product?.owner._id &&
      product.product?.product?.owner._id !== user.user.id
    )
      return (
        <PageNotFound message="You are not authorised to edit this product!" />
      );
    else if (product.product?.product?.owner)
      return (
        <>
          <div className="p-4">
            <div className="text-3xl text-center text-darktheme-300 pb-1 border-b border-darktheme-500">
              Edit your Product
            </div>
            <div className="flex w-full my-3 justify-center">
              <Button
                variant="contained"
                color="secondary"
                classes={{ root: classes.saveDetails }}
                startIcon={<SaveIcon />}
                onClick={() => this.saveProfileChanges()}
              >
                Save changes
              </Button>
              <Button
                variant="contained"
                color="primary"
                classes={{ root: classes.saveDetails }}
                startIcon={<SettingsBackupRestoreIcon />}
                onClick={() => this.resetProfileDetails()}
              >
                Restore changes
              </Button>
            </div>
            <Input
              label="Product Title"
              classes={classes}
              value={values.title}
              error={errors.title}
              onChange={(event) =>
                this.handleInputChange("title", event.target.value)
              }
              handleBlur={(event) =>
                this.handleBlur("title", event.target.value)
              }
            />
            <Input
              label="Product Description"
              multiline={true}
              rows={3}
              rowsMax={5}
              classes={classes}
              value={values.description}
              error={errors.description}
              onChange={(event) =>
                this.handleInputChange("description", event.target.value)
              }
              handleBlur={(event) =>
                this.handleBlur("description", event.target.value)
              }
            />

            <div className="flex justify-between mb:justify-start flex-wrap">
              <div className="w-24 mb:mr-16">
                <Input
                  label="Quantity"
                  classes={classes}
                  value={values.quantity}
                  error={errors.quantity}
                  onChange={(event) =>
                    this.handleInputChange("quantity", event.target.value)
                  }
                  handleBlur={(event) =>
                    this.handleBlur("quantity", event.target.value)
                  }
                  placeholder={"0"}
                />
              </div>
              <div className="w-32 mb:mr-16">
                <Input
                  Icon={AttachMoneyRoundedIcon}
                  label="Price"
                  classes={classes}
                  value={values.price}
                  error={errors.price}
                  onChange={(event) =>
                    this.handleInputChange("price", event.target.value)
                  }
                  handleBlur={(event) =>
                    this.handleBlur("price", event.target.value)
                  }
                  placeholder={"0"}
                />
              </div>
              <div className="flex-grow">
                <Input
                  label="Tags"
                  chipped={true}
                  classes={classes}
                  value={values.tags}
                  error={errors.tags}
                  info="Tags will help user find your product. Spaces separate tags."
                  handleAddChip={(chip) => this.handleAddChip(chip)}
                  handleDeleteChip={(chip, index) =>
                    this.handleDeleteChip(chip, index)
                  }
                  handleBlur={() => this.handleBlur("tags", values.tags)}
                />
              </div>
            </div>
            <div className="px-6 w-full flex flex-col mb:flex-row mt-4 mb:mt-0">
              <input
                accept="image/*"
                className={classes.input}
                id="productImages"
                multiple
                type="file"
                onChange={(event) => this.onChange(event)}
              />
              <label htmlFor="productImages">
                <Button
                  variant="contained"
                  classes={{ root: classes.upload }}
                  component="span"
                  startIcon={<BackupIcon fontSize="large" />}
                  endIcon={imageRendering && <AutorenewIcon />}
                >
                  Upload
                </Button>
              </label>
              <div className="mb-1 mb:mb-0 text-xs mb:text-sm font-sans text-darktheme-200">
                Your images will show up below. You can click on an image to
                delete it.
              </div>
            </div>
            <div className={classes.dragaAndDropContainer}>
              <DragAndDrop
                handleDrop={(files) => this.getDraggedFiles(files)}
                dropped={images.length > 0}
                reading={imageRendering}
              >
                <div className="mx-auto w-full grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-6">
                  {images.map((image, i) => {
                    return (
                      <UploadImageCard
                        key={i}
                        file={null}
                        image={image}
                        deleteImage={() => this.handleDeleteImage(i)}
                      />
                    );
                  })}
                </div>
              </DragAndDrop>
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
          {this.state.loading && <Loading />}
          {/* <NavigationPrompt when={this.state.changed}></NavigationPrompt> */}
        </>
      );
    else return <></>;
  }
}

const mapStateToProps = (state) => {
  return {
    product: state.product,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ getProductDetails, editProduct }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(EditProduct));
