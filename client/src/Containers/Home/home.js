import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { productList, allProductList } from "../../actions/product_actions";
import { bindActionCreators } from "redux";
import Carousel from "react-bootstrap/Carousel";
import ProductCard from "../../WidgetsUI/ProductCart/productCard";
import Fade from "react-reveal/Fade";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";

import cimage1 from "../../assets/cmiage1.jpg";
import cimage2 from "../../assets/cmiage2.jpg";
import cimage3 from "../../assets/cmiage3.jpg";
import Search from "./Search/search";
import Loading from "../../WidgetsUI/Loading/loading";
import ItemLoading from "../../WidgetsUI/Loading/itemLoading";
import "./home.css";

import { Controller, Scene } from "react-scrollmagic";
import ScrollMagic from "scrollmagic";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Filter from "../../WidgetsUI/Filter/filter";
import NoProducts from "../../WidgetsUI/NoProducts/noProducts";

const styles = (theme) => ({
  textField: {
    backgroundColor: "#202428",
    borderRadius: "5px",
    width: "100%",
  },
  inputRoot: {
    color: "white",
    padding: "3px",
    fontSize: "15px",
  },
  inputNotched: {
    borderColor: "#2d3748 !important",
  },
  searchIcon: {
    paddingLeft: "15px",
    paddingRight: "20px",
    borderRightWidth: "1px",
    borderColor: "gray",
    height: "100%",
    marginRight: "15px",
  },
  clearIndicator: {
    color: "#D2D8DD !important",
  },
  chip: {
    backgroundColor: "#33383D",
    color: "#D2D8DD",
    maxWidth: "150px",
  },
  listbox: {
    backgroundColor: "#202428",
    color: "white",
  },
  options: {
    "&:hover": {
      backgroundColor: "#343A40",
    },
  },
  slected: {
    backgroundColor: "#343A40",
  },
  groupLabel: {
    backgroundColor: "#202428",
    color: "white",
    borderBottomWidth: "1px",
    borderColor: "gray",
    fontSize: "25px",
  },
  autoComplete: {
    opacity: 0.7,
    transition: "ease-in 0.4s all",
    "&:hover": {
      opacity: 1,
    },
  },
  autocompleteFocus: {
    opacity: 1,
  },
  submit: {
    color: "#fff",
    opacity: 0.7,
    fontSize: "13px",
    transition: "ease-in 0.4s all",
    backgroundColor: "#202428",
    letterSpacing: "2px",
    marginLeft: "10px",
    [theme.breakpoints.down("xs")]: {
      marginTop: "8px",
    },
    "&:hover": {
      backgroundColor: "#202428",
      opacity: 1,
    },
    outline: "none !important",
    border: "none !important",
  },
  submitScroll: {
    color: "#fff",
    opacity: 1,
    fontSize: "13px",
    transition: "ease-in 0.4s all",
    backgroundColor: "#202428",
    letterSpacing: "2px",
    marginLeft: "10px",
    [theme.breakpoints.down("xs")]: {
      marginTop: "8px",
    },
    "&:hover": {
      backgroundColor: "#202428",
      opacity: 1,
    },
    outline: "none !important",
    border: "none !important",
  },
  tooltip: {
    backgroundColor: "black",
    maxWidth: "250px",
    fontSize: "14px",
  },
  arrowTooltip: {
    color: "black",
  },
});

let options = [];
let first = false;
let prevPos = 0;
let numberOfProducts = 0;

class Home extends Component {
  state = {
    images: [cimage1, cimage2, cimage3],
    loading: false,
    searchPushDown: false,
    searchArray: [],
    rating: [1, 5],
    priceRange: [0, 9999],
    sortby: 0,
    order: "desc",
    searchValues: [],
  };

  componentWillMount() {
    this.setState({ loading: true });
    this.itemLoading = React.createRef();
    this.searchRef = React.createRef();
    this.props.allProductList();
  }

  componentDidMount() {
    var controller = new ScrollMagic.Controller();

    new ScrollMagic.Scene({
      triggerElement: this.itemLoading.current,
      triggerHook: "onEnter",
    })
      .addTo(controller)
      .on("enter", () => this.handleOnScroll());

    new ScrollMagic.Scene({
      triggerElement: this.searchRef.current,
    })
      .addTo(controller)
      .on("update", (event) => {
        if (this.state.searchPushDown === true && event.scrollPos < 10) {
          this.setState({ searchPushDown: false });
        }
      });

    gsap.registerPlugin(ScrollToPlugin);

    window.addEventListener(
      "scroll",
      () => {
        var currentScrollPos = window.pageYOffset;
        if (
          currentScrollPos < prevPos &&
          currentScrollPos > 10 &&
          this.state.searchPushDown === false
        ) {
          this.setState({ searchPushDown: true });
        } else if (
          currentScrollPos > prevPos &&
          this.state.searchPushDown === true
        ) {
          this.setState({ searchPushDown: false });
        }
        prevPos = currentScrollPos;
      },
      { passive: true }
    );
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenToScroll);
  }

  getProductsToDisplay = () => {
    gsap.to(window, { scrollTo: 0 });
    this.props.productList(
      this.state.searchArray,
      this.state.rating,
      this.state.priceRange,
      this.state.sortby,
      this.state.order
    );
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.products.list) {
      if (first === false) {
        var tags = [];
        nextProps.products.list.products.forEach((product) => {
          options.push(product.title);
          product.tags.forEach((tag) => tags.push("#" + tag));
        });
        numberOfProducts = nextProps.products.list.products.length;
        options = [...options, ...tags];
        options = [...new Set(options)];
        first = true;
        this.getProductsToDisplay();
      }
      this.setState({ loading: false, itemLoading: false });
    }
  }

  handleOnSubmit = (event) => {
    event.preventDefault();
    this.setState(
      { loading: true, searchValues: [...this.state.searchArray] },
      () => this.getProductsToDisplay()
    );
  };

  handleOnScroll = () => {
    if (this.props.products.list) {
      this.props.productList(
        this.state.searchArray,
        this.state.rating,
        this.state.priceRange,
        this.state.sortby,
        this.state.order,
        6,
        this.props.products.list.products.length,
        this.props.products.list.products
      );
    }
  };

  applyFilters = (filterObject) => {
    const priceRange = [];
    filterObject.price[0] === "Min"
      ? priceRange.push(0)
      : priceRange.push(parseInt(filterObject.price[0]));
    filterObject.price[1] === "Max"
      ? priceRange.push(99999)
      : priceRange.push(parseInt(filterObject.price[1]));

    this.setState(
      {
        rating: filterObject.rating,
        priceRange,
        sortby: filterObject.sortby,
        order: filterObject.order,
        loading: true,
      },
      () => {
        this.getProductsToDisplay();
      }
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="scrolling-touch">
        <div className="flex justify-center items-center mb-4 h-56 relative">
          <div className="absolute inset-0">
            <Carousel interval={2000}>
              {this.state.images.map((image, i) => {
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
          </div>
          {this.props.products.list ? (
            <Controller>
              <Scene pin={true} offset={300}>
                {(progress, event) => {
                  var autoComplete = classes.autoComplete;
                  if (progress === 1) autoComplete = classes.autoCompleteFocus;
                  return (
                    <form
                      className={`w-full sm:justify-center justify-end sm:items-stretch sm:flex-row flex-col items-center flex z-30 transition-all duration-500 ease-out delay-75 ${
                        this.state.searchPushDown === true
                          ? "searchBarPushDown"
                          : "searchBarPushUp"
                      }`}
                      onSubmit={(event) => this.handleOnSubmit(event)}
                    >
                      <Search
                        placeholder={
                          this.props.products.list
                            ? `Search ${numberOfProducts} products...`
                            : ""
                        }
                        autoComplete={autoComplete}
                        value={this.state.searchArray}
                        classes={classes}
                        handleValueChange={(searchArray) =>
                          this.setState({ searchArray })
                        }
                        options={options}
                        test={() => console.log("Submit")}
                      />
                      <Button
                        variant="contained"
                        classes={{
                          root:
                            progress === 1
                              ? classes.submitScroll
                              : classes.submit,
                        }}
                        size="small"
                        type="submit"
                        onSubmit={(event) => this.handleOnSubmit(event)}
                      >
                        Search
                      </Button>
                    </form>
                  );
                }}
              </Scene>
            </Controller>
          ) : null}
          <div ref={this.searchRef}></div>
        </div>
        {this.state.searchValues.length > 0 ? (
          <div className="w-11/12 border-b-2 flex border-darktheme-700 mx-auto pb-2 mb-4 text-darktheme-200 text-base">
            <div className="mr-2">Showing results for</div>
            <div className="flex">
              {this.state.searchValues.map((searchItem, i) => (
                <Tooltip
                  title={searchItem}
                  placement="top-start"
                  classes={{
                    tooltip: classes.tooltip,
                    arrow: classes.arrowTooltip,
                  }}
                  arrow
                  interactive
                  key={i}
                >
                  <Chip
                    label={searchItem}
                    className="mr-2"
                    size="small"
                    classes={{ root: classes.chip }}
                  />
                </Tooltip>
              ))}
            </div>
          </div>
        ) : null}
        {this.props.products.list ? (
          <div className="mx-auto gap-20 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 w-3/4 sm:w-4/5 md:w-5/6">
            {this.props.products.list.products.map((product, i) => (
              <Fade bottom key={i} duration={300}>
                <ProductCard {...product} />
              </Fade>
            ))}
          </div>
        ) : null}
        {this.state.loading === true ? <Loading /> : null}
        <div ref={this.itemLoading}></div>
        {this.props.products.list ? (
          this.props.products.list.products.length > 0 ? (
            <ItemLoading allLoaded={!this.props.products.list.list} />
          ) : this.props.products.list.list === false ? (
            <NoProducts />
          ) : null
        ) : null}
        <Filter
          applyFilters={(filterObject) => this.applyFilters(filterObject)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.product,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ productList, allProductList }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Home));
