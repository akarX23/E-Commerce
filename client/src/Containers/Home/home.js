import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { productList } from "../../actions/product_actions";
import { bindActionCreators } from "redux";
import SearchIcon from "@material-ui/icons/Search";
import Carousel from "react-bootstrap/Carousel";
import ProductCard from "../../WidgetsUI/ProductCart/productCard";
import Fade from "react-reveal/Fade";

import cimage1 from "../../assets/cmiage1.jpg";
import cimage2 from "../../assets/cmiage2.jpg";
import cimage3 from "../../assets/cmiage3.jpg";

const styles = (theme) => ({
  textField: {
    backgroundColor: "#202428",
    borderRadius: "5px",
    width: "60%",
    opacity: 0.7,
    transition: "ease-in 0.4s all",
    "&:hover": {
      opacity: 1,
    },
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
});

class Home extends Component {
  state = {
    search: "",
    images: [cimage1, cimage2, cimage3],
  };

  handleChange = (event) => {
    this.setState({ search: event.target.value });
  };

  componentWillMount() {
    this.props.productList();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="custom-scrollbar">
        <div className="flex justify-center items-center mb-10 h-56 relative">
          <div className="absolute inset-0 z-0">
            <Carousel interval={3000}>
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
          <TextField
            className={classes.textField}
            placeholder="Search products..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" className={classes.searchIcon}>
                  <SearchIcon />
                </InputAdornment>
              ),
              classes: {
                root: classes.inputRoot,
                notchedOutline: classes.inputNotched,
              },
            }}
            size="small"
            variant="outlined"
            autoFocus
            color="primary"
            value={this.state.search}
            onChange={this.handleChange}
          />
        </div>
        {console.log(this.props)}
        {this.props.products.list ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-3/4 md:w-5/6 gap-24 mx-auto">
            {this.props.products.list.products.map((product, i) => (
              <Fade key={i} bottom>
                <ProductCard {...product} />
              </Fade>
            ))}
          </div>
        ) : null}
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
  ...bindActionCreators({ productList }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Home));
