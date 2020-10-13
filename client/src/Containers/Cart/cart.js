import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  changeQuantity,
  cartProductList,
  deleteItem,
} from "../../actions/cart_actions";
import { bindActionCreators } from "redux";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import CartItem from "../../WidgetsUI/CartItem/cartitem";
import Button from "@material-ui/core/Button";
import ShoppingBasketOutlinedIcon from "@material-ui/icons/ShoppingBasketOutlined";

import PageNotFound from "../../WidgetsUI/PageNotFound/pageNotFound";
import Loading from "../../WidgetsUI/Loading/loading";

const styles = (theme) => ({
  checkout: {
    backgroundColor: "#ed8936",
    "&:hover": {
      backgroundColor: "#c05621",
    },
    color: "white",
    outline: "none !important",
    border: "none !important",
    width: "150px",
    transition: "all 0.5s linear",
  },
});

class Cart extends Component {
  state = {
    loading: false,
    showAlert: false,
    alert: "",
    severity: "",
    quantity: [],
  };

  componentWillMount() {
    let quantity = [];
    this.props.cart.cartItems.items.forEach((item) =>
      quantity.push(item.quantity)
    );
    this.setState({ loading: true, quantity: [...quantity] });
    this.props.cartProductList();
  }

  componentWillReceiveProps(nextProps) {
    let showAlert = false,
      alert = "",
      severity = "",
      quantity = [];

    if (nextProps.cart.cartItems) {
      if (nextProps.cart.cartActions?.success === false) {
        showAlert = true;
        alert = "Something Went Wrong!";
        severity = "error";
      } else {
        nextProps.cart.cartItems.items.forEach((item) =>
          quantity.push(item.quantity)
        );
      }
    }
    this.setState({ loading: false, showAlert, alert, severity, quantity });
  }

  changeQuantityRequest = (id, quantity, price) => {
    this.props.changeQuantity(id, price, quantity);
  };

  checkOut = (items) => {
    let proceed = true,
      showAlert = false,
      alert = "",
      severity = "";
    items.forEach((item, i) => {
      if (
        !this.state.quantity[i] ||
        this.state.quantity[i] > item.product.quantity
      ) {
        proceed = false;
        showAlert = true;
        alert = "Your cart has errors in it!";
        severity = "error";
      }
    });

    if (proceed === false) {
      this.setState({ showAlert, alert, severity });
      return;
    }
    console.log("checked");
  };

  deleteCartItem = (id) => {
    this.setState({ loading: true });
    this.props.deleteItem(id);
  };

  getTotalPrice = (cartItems) => {
    let total = 0;
    cartItems.forEach((item) => (total += item.totalPrice));
    return total;
  };

  handleQuantityChange = (value, i) => {
    let newQuantity = [...this.state.quantity];
    newQuantity[i] = value;
    this.setState({ quantity: [...newQuantity] });
  };

  render() {
    const { loading, showAlert, alert, severity, quantity } = this.state;
    const { cart, classes } = this.props;

    return (
      <>
        {cart.cartItems && (
          <div className="p-2">
            <div className="mb-8 pb-1 w-full border-b text-3xl text-darktheme-100 border-darktheme-400">
              Your Cart
            </div>
            {cart.cartItems.items.length > 0 ? (
              <>
                <div className={`mt-2 w-full justify-center flex`}>
                  <div className="flex text-2xl text-darktheme-200 mr-10">
                    <div className="mr-2">Total : </div>
                    <div>{this.getTotalPrice(cart.cartItems.items)}</div>
                  </div>
                  <Button
                    startIcon={<ShoppingBasketOutlinedIcon />}
                    classes={{ root: classes.checkout }}
                    onClick={() => this.checkOut(cart.cartItems.items)}
                  >
                    checkout
                  </Button>
                </div>

                {cart.cartItems.items.map((item, i) => (
                  <div className="mt-3" key={i}>
                    <CartItem
                      {...item}
                      quantity={quantity[i]}
                      changeQuantity={(id, quantity, price) =>
                        this.changeQuantityRequest(id, quantity, price)
                      }
                      deleteItem={(id) => this.deleteCartItem(id)}
                      handleQuantityChange={(value) =>
                        this.handleQuantityChange(value, i)
                      }
                    />
                  </div>
                ))}
              </>
            ) : (
              <PageNotFound message="Add products to your cart to see them here!" />
            )}
          </div>
        )}

        {loading && <Loading />}
        <Snackbar
          open={showAlert}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => this.setState({ showAlert: false })}
        >
          <Alert
            variant="filled"
            severity={severity}
            onClose={() => this.setState({ showAlert: false })}
          >
            {alert}
          </Alert>
        </Snackbar>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    { changeQuantity, cartProductList, deleteItem },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Cart));
