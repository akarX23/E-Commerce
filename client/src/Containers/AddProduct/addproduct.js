import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { addProduct } from "../../actions/product_actions";
import { bindActionCreators } from "redux";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepConnector from "@material-ui/core/StepConnector";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DetailsRoundedIcon from "@material-ui/icons/DetailsRounded";
import PhotoLibraryRoundedIcon from "@material-ui/icons/PhotoLibraryRounded";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import NavigationPrompt from "react-router-navigation-prompt";

import ProductDetailsAdd from "./productDetailsAdd";
import ImageAdd from "./imageAdd";
import ConfirmProduct from "./confirmProduct";
import Confirmed from "./confirmed";
import Loading from "../../WidgetsUI/Loading/loading";

const styles = (theme) => ({
  stepper: {
    backgroundColor: "rgb(32, 36, 40, 0)",
  },
  stepLabel: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
    color: "white !important",
  },
});

const headings = [
  "Let's add the details for your product first",
  "Make your product look attractive with images",
  "Confirm your Product",
];

const stepIconStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#454B51",
    zIndex: 1,
    color: "#EAEDF0",
    [theme.breakpoints.down("xs")]: {
      width: 40,
      height: 40,
    },
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage: "linear-gradient( 95deg,#38a169 100%,#48bb78 100%)",
  },
  icon: {
    fontSize: "35px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "25px",
    },
  },
}));

class AddProduct extends Component {
  state = {
    activeStep: 0,
    productDetails: {
      description: "",
      price: "",
      quantity: "",
      tags: [],
      title: "",
    },
    images: [],
    files: [],
    loading: false,
    alertMessage: "",
    severity: "",
  };

  Connector = withStyles({
    alternativeLabel: {
      top: 22,
    },
    active: {
      "& $line": {
        backgroundImage:
          "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
      },
    },
    completed: {
      "& $line": {
        backgroundImage:
          "linear-gradient( 95deg,#68d391 100%,#38a169 100%,#4fd1c5 100%)",
      },
    },
    line: {
      height: 2,
      border: 0,
      backgroundColor: "#C3C9D0",
      borderRadius: 1,
    },
  })(StepConnector);

  StepIcon = (props) => {
    const classes = stepIconStyles();
    const { active, completed } = props;

    const icons = {
      1: <DetailsRoundedIcon classes={{ root: classes.icon }} />,
      2: <PhotoLibraryRoundedIcon />,
      3: <CheckCircleRoundedIcon />,
    };

    return (
      <div
        className={`${classes.root} ${active === true ? classes.active : ""} ${
          completed === true ? classes.completed : ""
        }`}
      >
        {icons[String(props.icon)]}
      </div>
    );
  };

  confirmDetails = () => {
    this.setState({ loading: true });
    document.body.style.overflow = "hidden";
    this.props.addProduct(this.state.productDetails, this.state.images);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.add.productAdd) {
      if (nextProps.add.productAdd.added === false)
        this.setState({
          loading: false,
          alertMessage: "Something went wrong.",
          severity: "error",
        });
      else {
        this.setState({
          loading: false,
          activeStep: this.state.activeStep + 1,
        });
      }
      document.body.style.overflow = "auto";
    }
  }

  getStepContent = () => {
    switch (this.state.activeStep) {
      case 0:
        return (
          <ProductDetailsAdd
            handleNext={(data) =>
              this.setState({
                productDetails: { ...data },
                activeStep: this.state.activeStep + 1,
              })
            }
            productDetails={this.state.productDetails}
          />
        );
      case 1:
        return (
          <ImageAdd
            imageData={this.state.images}
            fileData={this.state.files}
            stepChange={(images, files, changeInStep) =>
              this.setState({
                images: [...images],
                files: [...files],
                activeStep: this.state.activeStep + changeInStep,
              })
            }
          />
        );
      case 2:
        return (
          <ConfirmProduct
            productDetails={this.state.productDetails}
            productImages={this.state.images}
            files={this.state.files}
            handleBack={() =>
              this.setState({ activeStep: this.state.activeStep - 1 })
            }
            confirmDetails={() => this.confirmDetails()}
          />
        );
      case 3:
        return <Confirmed />;
      default:
        return "Unknown Step";
    }
  };

  getStepsLabel = () => {
    return ["Product Details", "Add Images", "Confirm"];
  };

  handleNext = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  render() {
    const { classes } = this.props;
    const steps = this.getStepsLabel();

    return (
      <>
        <Stepper
          activeStep={this.state.activeStep}
          classes={{ root: classes.stepper }}
          alternativeLabel
          connector={<this.Connector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={this.StepIcon}
                classes={{ label: classes.stepLabel }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="px-6">
          <h1 className="text-darktheme-300 text-base mb:text-xl md:text-3xl">
            {headings[this.state.activeStep]}
          </h1>
          <div className="border-b mt-1 border-darktheme-400 w-full"></div>
        </div>
        {this.getStepContent()}
        {this.state.loading === true && <Loading />}
        <Snackbar
          open={this.state.alertMessage !== ""}
          autoHideDuration={6000}
          onClose={() => this.setState({ alertMessage: "" })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="filled"
            onClose={() => this.setState({ alertMessage: "" })}
            severity={this.state.severity}
          >
            {this.state.alertMessage}
          </Alert>
        </Snackbar>
        <NavigationPrompt when={this.state.changed}></NavigationPrompt>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    add: state.product,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ addProduct }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddProduct));
