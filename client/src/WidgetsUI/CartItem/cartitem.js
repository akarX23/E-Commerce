import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { Rate } from "rsuite";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Fade from "react-reveal/Fade";
import Carousel from "react-bootstrap/Carousel";

import Input from "../InputUI/input";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up(500)]: {
      display: "flex",
    },
    width: "100%",
    outline: "none !important",
    border: "none !important",
    height: "auto",
    backgroundColor: "#202428",
  },
  imageContain: {
    [theme.breakpoints.up(500)]: {
      height: "250px",
      width: "100%",
      maxWidth: "350px",
    },
  },
  image: {
    height: "100px",
    width: "150px",
    [theme.breakpoints.up(500)]: {
      height: "100%",
      width: "100%",
    },
  },
  imageCarousel: {
    height: "100px",
    width: "150px",
    [theme.breakpoints.up(500)]: {
      height: "250px",
      width: "100%",
      maxWidth: "350px",
    },
  },
  titleAndRate: {
    [theme.breakpoints.up(500)]: {
      display: "none",
    },
  },
  titleAndRateLarge: {
    [theme.breakpoints.down(500)]: {
      display: "none",
    },
  },
  textField: {
    backgroundColor: "#33383D",
    borderRadius: "5px",
    width: "100%",
  },
  inputRoot: {
    color: "white",
    fontSize: "19px",
    fontFamily: "sans",
  },
  label: {
    fontSize: "15px",
  },
  altIcon: {
    color: "#4fd1c5",
    outline: "none !important",
    border: "none !important",
    padding: 0,
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    paddingRight: "10px",
    paddingBottom: "0.5rem",
    alignItems: "center",
  },
  delete: {
    width: "130px",
    outline: "none !important",
    border: "none !important",
    transition: "all 0.4s linear",
  },
}));

const CartItem = ({
  quantity,
  totalPrice,
  product,
  changeQuantity,
  deleteItem,
  handleQuantityChange,
}) => {
  const classes = useStyles();

  const [error, setError] = useState("");

  const handleInputChange = (value) => {
    let newError = error;

    if (
      value.toString()[value.toString().length - 1] !== "." &&
      isNaN(value) === false
    ) {
      newError = validateInput(value);
      handleQuantityChange(value);
      setError(newError);
    }
  };

  const handleBlur = (value) => {
    let newError = error;
    newError = validateInput(value);
    setError(newError);
    if (newError === "") changeQuantity(product._id, quantity, product.price);
  };

  const validateInput = (value) => {
    let error = "";

    if (value <= 0 || isNaN(value)) error = "Invalid Value";
    else if (value > product.quantity)
      error = "Maximum " + product.quantity + " allowed";
    else if (value === "") error = "This field is required";

    return error;
  };

  const increaseOne = () => {
    let newQuantity = quantity === "" ? 0 : quantity;
    let newError = error;
    newError = validateInput(parseInt(newQuantity) + 1);
    setError(newError);
    handleQuantityChange(parseInt(newQuantity) + 1);
    if (newError === "")
      changeQuantity(product._id, parseInt(newQuantity) + 1, product.price);
  };

  const renderQuantity = () => {
    return (
      <div className="-mt-6 w-full">
        <Input
          label="Quantity"
          placeholder="0"
          classes={classes}
          value={quantity}
          onChange={(event) => handleInputChange(event.target.value)}
          handleBlur={(event) => handleBlur(event.target.value)}
          inline={true}
          EndIcon={AddIcon}
          altIconTooltip="Add One"
          altIconAction={increaseOne}
        />
      </div>
    );
  };

  const renderPrice = () => {
    return (
      <div className="-mt-6 w-full">
        <Input
          label="Cost per Item"
          classes={classes}
          value={product.price}
          readonly={true}
          Icon={AttachMoneyIcon}
        />
      </div>
    );
  };

  const renderTotalPrice = () => {
    return (
      <div className="-mt-6 w-full">
        <Input
          label="Total Price"
          classes={classes}
          value={totalPrice}
          readonly={true}
          Icon={AttachMoneyIcon}
        />
      </div>
    );
  };

  const renderImage = () => {
    return (
      <div className={`w-full h-full`}>
        <Carousel
          interval={2000}
          controls={false}
          indicators={false}
          pause={false}
        >
          {product.imageURLs.map((url, i) => (
            <Carousel.Item key={i}>
              <img
                src={url}
                className={`object-cover object-center w-full h-full ${classes.imageCarousel}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    );
  };

  const renderTitleAndRating = () => {
    return (
      <>
        <div className="text-lg text-darktheme-200 font-bold">
          {product.title}
        </div>
        <Rate
          allowHalf
          value={parseFloat(product.rating)}
          readOnly
          color="yellow"
          size="xs"
        />
      </>
    );
  };

  const renderTableView = () => {
    return (
      <>
        <div className="grid grid-cols-3 w-full gap-4 p-2 mx-auto">
          {renderQuantity()}
          {renderPrice()}
          {renderTotalPrice()}
        </div>
      </>
    );
  };

  return (
    <>
      <Card
        classes={{ root: classes.root }}
        // component="a"
        // href={`/product/${product._id}`}
      >
        <div className={`flex ${classes.imageContain}`}>
          <div className={`${classes.image}`}>{renderImage()}</div>
          <div
            className={`w-full ${classes.titleAndRate} flex-grow flex flex-col justify-between p-2 pl-4`}
          >
            {renderTitleAndRating()}
          </div>
        </div>
        <div className="flex flex-col justify-between p-2 w-full">
          <div
            className={`w-full flex h-16 flex-col justify-between ${classes.titleAndRateLarge}`}
          >
            {renderTitleAndRating()}
          </div>
          {renderTableView()}
          <CardActions classes={{ root: classes.actions }}>
            <Fade
              when={error !== ""}
              bottom
              collapse
              duration={400}
              cascade
              fraction={0}
            >
              <div
                className={`p-2 font-medium -mt-3 w-full break-words text-red-1100 tracking-wider italic font-sans font-base`}
              >
                {error}
              </div>
            </Fade>
            <Button
              color="secondary"
              variant="contained"
              classes={{ root: classes.delete }}
              onClick={() => deleteItem(product._id)}
            >
              Delete
            </Button>
          </CardActions>
        </div>
      </Card>
    </>
  );
};

export default CartItem;
