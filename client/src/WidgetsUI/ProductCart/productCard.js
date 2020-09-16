import React from "react";

import Carousel from "react-bootstrap/Carousel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import { Rate } from "rsuite";
import Chip from "@material-ui/core/Chip";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Tooltip from "@material-ui/core/Tooltip";

import "./productCard.css";

import cimage1 from "../../assets/cmiage1.jpg";
import cimage2 from "../../assets/cmiage2.jpg";
import cimage3 from "../../assets/cmiage3.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    borderRadius: "10px",
    border: "none !important",
    "&:hover": {
      cursor: "pointer",
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
  tags: {
    color: "#D37292",
    borderColor: "#D37292",
    borderWidth: "2px",
    transition: "all 0.2s ease-in",
    fontWeight: "500 !important",
    fontSize: "15px",
    margin: "3px",
    "&:hover": {
      backgroundColor: "#D37292 !important",
      color: "black",
    },
  },
  tooltip: {
    backgroundColor: "black",
    maxWidth: "250px",
    fontSize: "14px",
  },
  arrowTooltip: {
    color: "black",
  },
}));

const ProductCard = ({
  title,
  price,
  rating,
  tags,
  _id,
  owner,
  userReview,
}) => {
  const images = [cimage1, cimage2, cimage3];
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      <Card
        className={classes.root}
        component="a"
        elevation={5}
        href={`/product?id=${_id}`}
      >
        <div className="block card-container w-auto card-container h-auto rounded-lg overflow-hidden hover:scale-105 transition-all transform duration-500 ease-in-out text-white">
          <Carousel
            interval={3000}
            controls={false}
            indicators={false}
            pause={false}
          >
            {images.map((image, i) => {
              return (
                <Carousel.Item key={i}>
                  <img
                    src={image}
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
          <CardActions classes={{ root: classes.cardActions }}>
            <div className="w-full text-center flex-wrap flex">
              {tags.map((tag, i) => (
                <Chip
                  label={"#" + tag}
                  key={i}
                  variant="outlined"
                  size={matches ? "small" : "medium"}
                  clickable
                  classes={{ root: classes.tags }}
                />
              ))}
            </div>
          </CardActions>
        </div>
      </Card>
    </>
  );
};

export default ProductCard;
