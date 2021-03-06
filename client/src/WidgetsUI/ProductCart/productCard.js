import React from "react";

import Carousel from "react-bootstrap/Carousel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import { Rate } from "rsuite";
import Tooltip from "@material-ui/core/Tooltip";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    borderRadius: "10px",
    border: "none !important",
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 0 15px #697076",
    },
    textDecoration: "none !important",
  },
  cardContent: {
    backgroundColor: "#202428 !important",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "5px",
  },
  cardActions: {
    backgroundColor: "#202428 !important",
    marginTop: "-15px",
  },
  rating: {
    color: "#4fd1c5",
  },
  price: {
    color: "#C3C9D0",
    fontSize: "50px",
  },
  tooltip: {
    backgroundColor: "black",
    maxWidth: "250px",
    fontSize: "14px",
  },
  arrowTooltip: {
    color: "black",
  },
  productAction: {
    color: "#fff !important",
    fontSize: "14px",
    transition: "ease-in 0.2s all",
    backgroundColor: "#fb641b",
    "&:hover": {
      backgroundColor: "#38a169",
    },
    outline: "none !important",
    border: "none !important",
  },
}));

const ProductCard = ({
  title,
  price,
  rating,
  imageURLs,
  _id,
  owner,
  userReview,
  noTags,
  noExpand,
  userId,
  addToCart,
}) => {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.root} elevation={5}>
        <div
          className={`block w-auto h-auto rounded-lg overflow-hidden text-white`}
        >
          <a href={`/product/${_id}`}>
            <Carousel
              interval={3000}
              controls={false}
              indicators={false}
              pause={false}
            >
              {imageURLs.map((imagesrc, i) => {
                return (
                  <Carousel.Item key={i}>
                    <img
                      src={imagesrc}
                      className="object-cover object-center d-block w-100 h-56"
                      alt="carousel"
                    />
                  </Carousel.Item>
                );
              })}
            </Carousel>
            <CardContent classes={{ root: classes.cardContent }}>
              <p className="font-hairline text-xs text-darktheme-500">
                Sold by{" "}
                <span className="underline">
                  {owner.name + " " + owner.lastname}
                </span>
              </p>
              <Tooltip
                title={title}
                classes={{
                  tooltip: classes.tooltip,
                  arrow: classes.arrowTooltip,
                }}
                arrow
                placement="top-start"
                interactive
              >
                <div className="text-lg truncate text-darktheme-300 font-bold">
                  {title}
                </div>
              </Tooltip>
              <div className="block">
                <Rate
                  allowHalf
                  value={parseFloat(rating)}
                  readOnly
                  color="yellow"
                  size="xs"
                />
                <Typography
                  display="inline"
                  variant="body1"
                  classes={{ root: classes.rating }}
                >
                  ({userReview.length + 1})
                </Typography>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 77.52 122.88"
                  className="h-5 w-5 fill-current text-white"
                >
                  <path
                    d="M1.24 0h75.1c.64 0 1.17.54 1.17 1.2v11.45c0 .66-.53 1.2-1.17 1.2H52.89c3.7 4.3 6.34 9.48 7.54 15.18h15.92c.64 0 1.17.54 1.17 1.2v11.45c0 .66-.53 1.2-1.17 1.2H60.43c-1.44 6.82-4.95 12.91-9.86 17.62-6.44 6.17-15.29 10-25.03 10v.04h-1.08l42.13 48.04c1.14 1.3-.86 4.19-1.75 4.19l-19.48.11L.38 71.6c-.37-.42-.47-1-.31-1.52V51.3h25.46v.04c4.58 0 8.73-1.79 11.73-4.67 1.17-1.12 2.15-2.4 2.92-3.8H1.24c-.64 0-1.17-.54-1.17-1.2V30.22c0-.66.53-1.2 1.17-1.2h38.94c-.76-1.4-1.75-2.68-2.92-3.8-3-2.88-7.15-4.67-11.73-4.67v.04H.07V1.2C.08.54.6 0 1.24 0z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-darktheme-400 text-3xl ml-2">{price}</div>
              </div>
            </CardContent>
          </a>
          {!noTags && (
            <CardActions classes={{ root: classes.cardActions }}>
              <>
                <div className="w-full justify-center flex">
                  {userId !== owner._id ? (
                    <Button
                      classes={{ root: classes.productAction }}
                      variant="contained"
                      startIcon={
                        <AddShoppingCartIcon style={{ fontSize: 20 }} />
                      }
                      onClick={() => addToCart(_id, price)}
                    >
                      ADD TO CART
                    </Button>
                  ) : (
                    <div>
                      <Button
                        classes={{ root: classes.productAction }}
                        variant="contained"
                        startIcon={<EditIcon style={{ fontSize: 20 }} />}
                        href={`/product/edit/${_id}`}
                      >
                        Edit this product
                      </Button>
                    </div>
                  )}
                </div>
              </>
            </CardActions>
          )}
        </div>
      </Card>
    </>
  );
};

export default ProductCard;
