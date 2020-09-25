import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AttachMoneyRoundedIcon from "@material-ui/icons/AttachMoneyRounded";

import UploadImageCard from "../../WidgetsUI/UploadImageCard/uploadimagecard";
import Input from "../../WidgetsUI/InputUI/input";

const useStyles = makeStyles((theme) => ({
  prevStep: {
    outline: "none !important",
    border: "none !important",
  },
  confirm: {
    outline: "none !important",
    border: "none !important",
    marginLeft: "20px",
    backgroundColor: "#38a169",
    color: "white",
    "&:hover": {
      backgroundColor: "#2f855a",
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
}));

const ConfirmProduct = ({
  productDetails,
  productImages,
  files,
  handleBack,
  confirmDetails,
}) => {
  const classes = useStyles();

  return (
    <div className="mx-auto px-3 w-full">
      <div className="flex w-full mt-3 px-6 justify-end">
        <Button
          variant="contained"
          color="primary"
          classes={{ root: classes.prevStep }}
          startIcon={<ChevronLeftIcon />}
          onClick={() => handleBack()}
        >
          BACK
        </Button>
        <Button
          variant="contained"
          classes={{ root: classes.confirm }}
          endIcon={<CheckCircleIcon />}
          onClick={() => confirmDetails()}
        >
          CONFIRM
        </Button>
      </div>
      <Input
        label="Product Title"
        classes={classes}
        value={productDetails.title}
        readonly={true}
      />
      <Input
        label="Product Description"
        multiline={true}
        rows={3}
        rowsMax={5}
        classes={classes}
        value={productDetails.description}
        readonly={true}
      />

      <div className="flex justify-between mb:justify-start flex-wrap">
        <div className="w-24 mb:mr-16">
          <Input
            label="Quantity"
            classes={classes}
            value={productDetails.quantity}
            readonly={true}
          />
        </div>
        <div className="w-32 mb:mr-16">
          <Input
            Icon={AttachMoneyRoundedIcon}
            label="Price"
            classes={classes}
            value={productDetails.price}
            readonly={true}
          />
        </div>
        <div className="flex-grow">
          <Input
            label="Tags"
            chipped={true}
            classes={classes}
            value={productDetails.tags}
            info="Tags will help user find your product. Spaces separate tags."
            readonly={true}
          />
        </div>
      </div>
      <div className="mx-auto mt-4 w-full grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-6">
        {files.map((file, i) => (
          <UploadImageCard
            key={i}
            file={file}
            image={productImages[i]}
            readonly={true}
          />
        ))}
      </div>
    </div>
  );
};

export default ConfirmProduct;
