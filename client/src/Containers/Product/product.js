import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  getProductDetails,
  postReview,
  deleteReview,
  updateLikes,
} from "../../actions/product_actions";
import { bindActionCreators } from "redux";
import Carousel from "react-bootstrap/Carousel";
import Button from "@material-ui/core/Button";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Tooltip from "@material-ui/core/Tooltip";
import { Rate } from "rsuite";
import Chip from "@material-ui/core/Chip";
import withWidth from "@material-ui/core/withWidth";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import GetAppIcon from "@material-ui/icons/GetApp";

import PageNotFound from "../../WidgetsUI/PageNotFound/pageNotFound";
import Loading from "../../WidgetsUI/Loading/loading";
import { Controller, Scene } from "react-scrollmagic";
import Fade from "react-reveal/Fade";
import Comment from "../../WidgetsUI/Comment/comment";

import cimage1 from "../../assets/cmiage1.jpg";
import cimage2 from "../../assets/cmiage2.jpg";
import cimage3 from "../../assets/cmiage3.jpg";
import "./product.css";

const styles = (theme) => ({
  productCaraousel: {
    height: "400px",
  },
  caraouselSelector: {
    width: "50px",
    height: "50px",
  },
  addToCart: {
    color: "#fff",
    fontSize: "20px",
    transition: "ease-in 0.2s all",
    backgroundColor: "#fb641b",
    width: "60%",
    "&:hover": {
      backgroundColor: "#38a169",
    },
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "20px",
    maxWidth: "300px",
    minWidth: "fit-content",
    outline: "none !important",
    border: "none !important",
  },
  tags: {
    color: "#faf5ff",
    backgroundColor: "#434190",
    marginRight: "10px",
    fontSize: "15px",
    boxShadow: "0 0 2px 2px #a3bffa",
    marginTop: "0.75rem",
    marginBottom: "0.75rem",
  },
  rateProduct: {
    color: "#fff",
    fontSize: "13px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "11px",
    },
    transition: "ease-in 0.2s all",
    width: "fit-content",
    height: "fit-content",
    backgroundColor: "#2f855a",
    outline: "none !important",
    border: "none !important",
    fontFamily: "serif",
    "&:hover": {
      backgroundColor: "#ecc94b",
      color: "#000",
    },
  },
  linkCopyIcon: {
    width: "60px",
    height: "60px",
    outline: "none !important",
    border: "none !important",
    margin: 0,
    color: "#4c51bf",
  },
  reviewDialogue: {
    backgroundColor: "#343A40",
  },
  reviewDialogueTitle: {
    color: "#EAEDF0",
    fontSize: "19px",
  },
  comment: {
    backgroundColor: "#202428",
    borderRadius: "10px",
    marginTop: "5p",
  },
  commentRoot: {
    color: "white",
    padding: "15px",
    fontSize: "15px",
  },
  commentNotched: {
    borderColor: "#32383E !important",
  },
  reviewSubmitControls: {
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
  downloadButton: {
    color: "#D2D8DD",
    outline: "none !important",
    border: "none !important",
  },
});

const rateHover = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

class Product extends Component {
  state = {
    images: [
      cimage1,
      cimage2,
      cimage3,
      cimage1,
      cimage2,
      cimage3,
      cimage1,
      cimage2,
      cimage3,
    ],
    activeIndex: 0,
    loading: false,
    myReview: {},
    rating: 0,
    comment: "",
    ratingHover: 0,
    reviewList: {},
    product: {},
    linkCopied: false,
    ratingDialogue: false,
    deleteDialogue: false,
    showSnackbar: false,
    severity: "",
    message: "",
    vertical: "bottom",
    horizontal: "left",
    liked: false,
    disliked: false,
  };

  componentDidMount() {
    this.setState({ loading: true }, () =>
      this.props.getProductDetails(this.props.queries.id)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product.product) {
      let myReview = {},
        rating = 5,
        ratingHover = 5,
        comment = "",
        reviewList = [],
        product = {},
        showSnackbar = false,
        severity = "",
        message = "",
        vertical = "bottom",
        horizontal = "left";

      if (nextProps.product.review) {
        if (
          nextProps.product.review.reviewAdded === true ||
          nextProps.product.review.deleted === true ||
          nextProps.product.review.updateLikes === true
        ) {
          if (
            (nextProps.product.review.reviewAdded ||
              nextProps.product.review.deleted) &&
            nextProps.user.user.isAuth === this.props.user.user.isAuth
          ) {
            showSnackbar = true;
            severity = "success";

            if (nextProps.product.review.reviewAdded === true)
              message = "Review Added successfully!";
            else if (nextProps.product.review.deleted === true)
              message = "Review Deleted successfully!";
          }
          reviewList = nextProps.product.review.product.userReview;
          product = nextProps.product.review.product;
        } else {
          message = "Something went wrong. Please try again!!";
          severity = "error";
          reviewList = this.state.reviewList;
          product = this.state.product;
        }
      } else {
        reviewList = nextProps.product.product.product.userReview;
        product = nextProps.product.product.product;
      }

      reviewList = reviewList.filter((review) => {
        if (
          nextProps.user.user.isAuth === true &&
          review.userInfo.id === nextProps.user.user.id
        ) {
          myReview = review;
          rating = review.rating;
          ratingHover = rating;
          comment = review.comment;
          return false;
        }
        return true;
      });

      this.setState({
        loading: false,
        myReview,
        rating,
        ratingHover,
        comment,
        reviewList,
        product,
        showSnackbar,
        severity,
        message,
        vertical,
        horizontal,
      });
    }
  }

  getQuantityLabel = (quantity) => {
    let styles = "",
      label = "";
    if (quantity === 0) {
      styles = "text-danger";
      label = "Out of Stock!";
    } else if (quantity < 5) {
      styles = "text-warning";
      label = `Hurry Up! Only ${quantity} left!`;
    } else {
      styles = "text-success";
      label = "In Stock";
    }

    return (
      <div className={`text-xl ${styles} font-serif tracking-wide`}>
        {label}
      </div>
    );
  };

  toggleRatingDialogue = () => {
    if (this.props.user.user.isAuth === false) {
      this.setState({
        message: "You need to be logged in to post a review!",
        severity: "error",
        showSnackbar: true,
        vertical: "top",
        horizontal: "center",
      });
    } else this.setState({ ratingDialogue: !this.state.ratingDialogue });
  };

  toggleDeleteDialogue = () => {
    this.setState({ deleteDialogue: !this.state.deleteDialogue });
  };

  toggleSnackbar = () => {
    this.setState({ showSnackbar: !this.state.showSnackbar });
  };

  sendReviewData = () => {
    this.setState(
      { loading: true, ratingDialogue: !this.state.ratingDialogue },
      () => {
        this.props.postReview(
          this.props.queries.id,
          this.state.rating,
          this.state.comment
        );
      }
    );
  };

  sendDeleteRequest = () => {
    this.setState(
      { loading: true, deleteDialogue: !this.state.deleteDialogue },
      () => {
        this.props.deleteReview(this.props.queries.id);
      }
    );
  };

  sendCommentLikeRequest = (liked, disliked, action, ownerId) => {
    if (this.props.user.user.isAuth === false) {
      this.setState({
        message: "You need to be logged in to post a review!",
        severity: "error",
        showSnackbar: true,
        vertical: "top",
        horizontal: "center",
      });
      return;
    }
    if (action === "liked") {
      liked = !liked;
      disliked = false;
    } else if (action === "disliked") {
      disliked = !disliked;
      liked = false;
    }

    this.props.updateLikes(liked, disliked, ownerId, this.props.queries.id);
  };

  render() {
    const { classes } = this.props;
    const mobile = this.props.width === "xs";
    const details = this.state.product;

    return (
      <>
        {this.props.product.product ? (
          this.props.product.product.found === true ? (
            <div className="w-full sm:flex h-full">
              <div className="sm:w-1/2 flex-grow-0 flex-shrink-0 w-full h-auto relative">
                <Controller>
                  <Scene pin={mobile === true ? false : true} offset={270}>
                    <div className="w-full flex flex-col h-auto">
                      <Carousel
                        interval={2000}
                        activeIndex={this.state.activeIndex}
                        onSelect={(selectedIndex, e) =>
                          this.setState({ activeIndex: selectedIndex })
                        }
                      >
                        {details.imageURLs.map((imagesrc, i) => {
                          return (
                            <Carousel.Item key={i}>
                              <img
                                src={imagesrc}
                                className={`object-cover object-center w-full ${classes.productCaraousel}`}
                                alt="carousel"
                              />
                            </Carousel.Item>
                          );
                        })}
                      </Carousel>
                      <Tooltip title="Download Image" placement="left">
                        <div className="absolute z-10 right-0 top-0 bg-darktheme-800 rounded-b-lg">
                          <a
                            href={this.state.images[this.state.activeIndex]}
                            download
                          >
                            <IconButton
                              classes={{ root: classes.downloadButton }}
                            >
                              <GetAppIcon />
                            </IconButton>
                          </a>
                        </div>
                      </Tooltip>
                      <div
                        className={`flex ${
                          this.state.images.length <= 6 ? "justify-center" : ""
                        } overflow-x-auto overflow-y-hidden transition-all duration-200 ease-in-out`}
                      >
                        {details.imageURLs.map((imagesrc, i) => (
                          <div
                            className={`mx-3 my-3 flex-shrink-0 flex-grow-0 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-125 ${classes.caraouselSelector}`}
                            key={i}
                            onMouseOver={() =>
                              this.setState({ activeIndex: i })
                            }
                          >
                            <img
                              src={imagesrc}
                              className={`object-cover object-center w-full h-full`}
                              alt="carousel"
                            />
                          </div>
                        ))}
                      </div>
                      <Button
                        classes={{ root: classes.addToCart }}
                        variant="contained"
                        startIcon={
                          <AddShoppingCartIcon style={{ fontSize: 30 }} />
                        }
                      >
                        ADD TO CART
                      </Button>
                    </div>
                  </Scene>
                </Controller>
              </div>
              <div
                className={`break-words flex flex-col items-start justify-start box-border ml-4 mr-2 `}
              >
                <div className="sm:text-4xl text-2xl flex justify-between w-full mt-3 sm:mt-0 text-darktheme-200">
                  <p>{details.title}</p>
                  <Tooltip
                    title={
                      this.state.linkCopied === true
                        ? "Link Copied!"
                        : "Copy Link"
                    }
                    arrow
                    placement="bottom"
                    onClose={() =>
                      setTimeout(
                        () => this.setState({ linkCopied: false }),
                        240
                      )
                    }
                  >
                    <IconButton
                      classes={{ root: classes.linkCopyIcon }}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `http://localhost:3000/product/${this.props.queries.id}`
                        );
                        this.setState({ linkCopied: true });
                      }}
                      edge="start"
                    >
                      <svg
                        className="w-full h-full"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                      </svg>
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="flex items-center">
                  <Rate
                    allowHalf
                    value={parseFloat(details.rating)}
                    readOnly
                    color="yellow"
                    size="sm"
                  />
                  <div className="text-darktheme-500 text-base font-mono">
                    {details.userReview.length + 1} Ratings
                  </div>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 77.52 122.88"
                    className="h-6 w-6 fill-current text-darktheme-100 mr-2"
                  >
                    <path
                      d="M1.24 0h75.1c.64 0 1.17.54 1.17 1.2v11.45c0 .66-.53 1.2-1.17 1.2H52.89c3.7 4.3 6.34 9.48 7.54 15.18h15.92c.64 0 1.17.54 1.17 1.2v11.45c0 .66-.53 1.2-1.17 1.2H60.43c-1.44 6.82-4.95 12.91-9.86 17.62-6.44 6.17-15.29 10-25.03 10v.04h-1.08l42.13 48.04c1.14 1.3-.86 4.19-1.75 4.19l-19.48.11L.38 71.6c-.37-.42-.47-1-.31-1.52V51.3h25.46v.04c4.58 0 8.73-1.79 11.73-4.67 1.17-1.12 2.15-2.4 2.92-3.8H1.24c-.64 0-1.17-.54-1.17-1.2V30.22c0-.66.53-1.2 1.17-1.2h38.94c-.76-1.4-1.75-2.68-2.92-3.8-3-2.88-7.15-4.67-11.73-4.67v.04H.07V1.2C.08.54.6 0 1.24 0z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-5xl font-serif text-darktheme-100">
                    {details.price}
                  </div>
                </div>
                {this.getQuantityLabel(details.quantity)}
                <div className="flex flex-col">
                  <div className="text-3xl text-white font-medium">
                    Product Description
                  </div>
                  <div className="font-serif text-base text-darktheme-300">
                    {details.description}
                  </div>
                </div>
                <div className="w-auto rounded-lg border-2 border-darktheme-700 bg-darktheme-900 mt-4 px-3 box-border">
                  {details.tags.map((tag, i) => {
                    return (
                      <Chip
                        label={"#" + tag}
                        key={i}
                        size={mobile === true ? "small" : "medium"}
                        classes={{ root: classes.tags }}
                      />
                    );
                  })}
                </div>
                <div className="flex mt-3 items-center">
                  <div className="font-sans text-lg sm:text-2xl text-darktheme-400">
                    Seller
                  </div>
                  <div className="ml-4 font-sans text-base sm:text-xl text-darktheme-500">
                    {details.owner.name + " " + details.owner.lastname}
                  </div>
                </div>
                <div className="flex flex-col mt-1 w-full">
                  <div className="flex justify-between items-center box-border w-full pb-1 border-b border-teal-300">
                    <div className="sm:text-3xl text-lg text-teal-500 font-medium">
                      Customer Reviews
                    </div>
                    <Button
                      variant="contained"
                      size="small"
                      classes={{ root: classes.rateProduct }}
                      onClick={() => this.toggleRatingDialogue()}
                    >
                      Rate this product
                    </Button>
                  </div>
                  {this.state.myReview.rating ? (
                    <>
                      <Fade left duration={400}>
                        <Comment
                          {...this.state.myReview}
                          userComment={true}
                          openReviewEdit={() => this.toggleRatingDialogue()}
                          openReviewDelete={() => this.toggleDeleteDialogue()}
                        />
                        <div className="border-b border-darktheme-700 mt-3 w-11/12 mx-auto"></div>
                      </Fade>
                    </>
                  ) : null}
                  {this.state.reviewList.length === 0 ? (
                    <div className="text-2xl text-darktheme-200 mx-auto pt-4">
                      This product has not been reviewed yet
                    </div>
                  ) : (
                    this.state.reviewList.map((review, i) => {
                      let liked = review.usersLiked.includes(
                        this.props.user.user.id
                      );
                      let disliked = review.usersDisliked.includes(
                        this.props.user.user.id
                      );
                      return (
                        <Fade left duration={400} key={i}>
                          <Comment
                            {...review}
                            liked={liked}
                            disliked={disliked}
                            likes={review.usersLiked.length}
                            dislikes={review.usersDisliked.length}
                            sendCommentLikeRequest={(action) =>
                              this.sendCommentLikeRequest(
                                liked,
                                disliked,
                                action,
                                review.userInfo.id
                              )
                            }
                          />
                        </Fade>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <PageNotFound
              message={"The Product you are looking for does not exist!"}
            />
          )
        ) : null}
        <Dialog
          open={this.state.ratingDialogue}
          onClose={() => this.toggleRatingDialogue()}
          classes={{ paper: classes.reviewDialogue }}
        >
          <DialogTitle classes={{ root: classes.reviewDialogueTitle }}>
            Your review matters a lot to us. Thank you for your feedback!
          </DialogTitle>
          <DialogContent
            dividers
            classes={{ root: classes.reviewDialogueContent }}
          >
            <div className="text-darktheme-200 text-base font-serif">
              Rating
            </div>
            <div className="flex items-center mb-2">
              <Rate
                size="sm"
                allowHalf
                color="yellow"
                defaultValue={5}
                value={this.state.rating}
                onChange={(value) => this.setState({ rating: value })}
                onChangeActive={(value) =>
                  this.setState({ ratingHover: value })
                }
              />
              <div className="text-lg ml-2 font-serif text-darktheme-200">
                {rateHover[this.state.ratingHover]}
              </div>
            </div>
            <div className="text-darktheme-200 text-base mt-3 mb-2 font-serif">
              Comment
            </div>
            <TextField
              multiline={true}
              rows={3}
              rowsMax={6}
              variant="outlined"
              fullWidth
              value={this.state.comment}
              onChange={(event) =>
                this.setState({ comment: event.target.value })
              }
              classes={{ root: classes.comment }}
              placeholder="Your comment...."
              InputProps={{
                classes: {
                  root: classes.commentRoot,
                  notchedOutline: classes.commentNotched,
                },
                autoComplete: "new-password",
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              classes={{ root: classes.reviewSubmitControls }}
              onClick={() => this.sendReviewData()}
            >
              confirm
            </Button>
            <Button
              classes={{ root: classes.reviewSubmitControls }}
              onClick={() => this.toggleRatingDialogue()}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.deleteDialogue}
          onClose={() => this.toggleDeleteDialogue()}
          classes={{ paper: classes.reviewDialogue }}
        >
          <DialogTitle classes={{ root: classes.reviewDialogueTitle }}>
            Are you sure you want to delete your comment?
          </DialogTitle>
          <DialogActions>
            <Button
              classes={{ root: classes.reviewSubmitControls }}
              onClick={() => this.sendDeleteRequest()}
            >
              Yes
            </Button>
            <Button
              classes={{ root: classes.reviewSubmitControls }}
              onClick={() => this.toggleDeleteDialogue()}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.loading ? <Loading /> : null}
        <Snackbar
          open={this.state.showSnackbar}
          autoHideDuration={3000}
          onClose={() => this.toggleSnackbar()}
          anchorOrigin={{
            vertical: this.state.vertical,
            horizontal: this.state.horizontal,
          }}
        >
          <Alert variant="filled" severity={this.state.severity}>
            {this.state.message}
          </Alert>
        </Snackbar>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    product: state.product,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    { getProductDetails, postReview, deleteReview, updateLikes },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withWidth()(Product)));
