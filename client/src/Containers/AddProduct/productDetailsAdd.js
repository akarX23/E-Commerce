import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AttachMoneyRoundedIcon from "@material-ui/icons/AttachMoneyRounded";
import Button from "@material-ui/core/Button";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import Input from "../../WidgetsUI/InputUI/input";

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
  stepHandler: {
    outline: "none !important",
    border: "none !important",
    backgroundColor: "#38a169",
    color: "white",
    "&:hover": {
      backgroundColor: "#2f855a",
    },
    width: "170px",
  },
}));

const ProductDetailsAdd = ({ handleNext, productDetails }) => {
  const classes = useStyles();

  const [data, setData] = useState({
    ...productDetails,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    quantity: "",
    price: "",
    tags: "",
  });

  const [showError, setShowError] = useState(false);

  const handleInputChange = (inputName, value) => {
    let newErrors = { ...errors };

    if (
      (inputName === "quantity" &&
        value.toString()[value.toString().length - 1] !== "." &&
        isNaN(value) === false) ||
      (inputName === "price" && isNaN(value) === false) ||
      (inputName !== "quantity" && inputName !== "price")
    ) {
      newErrors[inputName] = validateInputs(inputName, value);
      setData({ ...data, [inputName]: value });
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

  const handleAddChip = (chip) => {
    let tags = [...data.tags];
    tags.push(chip);
    setData({ ...data, tags: [...tags] });
    setErrors({ ...errors, tags: validateInputs("tags", tags) });
  };

  const handleDeleteChip = (chip, index) => {
    let tags = [...data.tags];
    tags = tags.filter((tag) => tag !== chip);
    setData({ ...data, tags: [...tags] });
    setErrors({ ...errors, tags: validateInputs("tags", tags) });
  };

  const changeStep = () => {
    let newErrors = { ...errors };
    let allValid = true;
    let error = "";

    Object.keys(errors).forEach((key) => {
      error = validateInputs(key, data[key]);
      if (error !== "") allValid = false;
      newErrors[key] = error;
    });
    setErrors({ ...newErrors });
    if (allValid === true) handleNext(data);
    else setShowError(true);
  };

  return (
    <div className="px-6">
      <div className="px-3 mx-auto w-full">
        <div className="flex w-full mt-3 justify-end -mb-6">
          <Button
            variant="contained"
            color="primary"
            classes={{ root: classes.stepHandler }}
            onClick={() => changeStep()}
            endIcon={<ChevronRightIcon />}
          >
            NEXT
          </Button>
        </div>
        <Input
          label="Product Title"
          classes={classes}
          value={data.title}
          error={errors.title}
          onChange={(event) => handleInputChange("title", event.target.value)}
          handleBlur={(event) => handleBlur("title", event.target.value)}
        />
        <Input
          label="Product Description"
          multiline={true}
          rows={3}
          rowsMax={5}
          classes={classes}
          value={data.description}
          error={errors.description}
          onChange={(event) =>
            handleInputChange("description", event.target.value)
          }
          handleBlur={(event) => handleBlur("description", event.target.value)}
        />

        <div className="flex justify-between mb:justify-start flex-wrap">
          <div className="w-24 mb:mr-16">
            <Input
              label="Quantity"
              classes={classes}
              value={data.quantity}
              error={errors.quantity}
              onChange={(event) =>
                handleInputChange("quantity", event.target.value)
              }
              handleBlur={(event) => handleBlur("quantity", event.target.value)}
              placeholder={"0"}
            />
          </div>
          <div className="w-32 mb:mr-16">
            <Input
              Icon={AttachMoneyRoundedIcon}
              label="Price"
              classes={classes}
              value={data.price}
              error={errors.price}
              onChange={(event) =>
                handleInputChange("price", event.target.value)
              }
              handleBlur={(event) => handleBlur("price", event.target.value)}
              placeholder={"0"}
            />
          </div>
          <div className="flex-grow">
            <Input
              label="Tags"
              chipped={true}
              classes={classes}
              value={data.tags}
              error={errors.tags}
              info="Tags will help user find your product. Spaces separate tags."
              handleAddChip={(chip) => handleAddChip(chip)}
              handleDeleteChip={(chip, index) => handleDeleteChip(chip, index)}
              handleBlur={() => handleBlur("tags", data.tags)}
            />
          </div>
        </div>
      </div>
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
          All fields are not valid!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductDetailsAdd;
