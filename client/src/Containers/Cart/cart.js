import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  changeQuantity,
  cartProductList,
  deleteItem,
  clearCartActions,
  makePayment,
  clearCart,
} from "../../actions/cart_actions";
import {
  addOrderHistory,
  clearOrderAction,
} from "../../actions/orderHistory_actions";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import ShoppingBasketOutlinedIcon from "@material-ui/icons/ShoppingBasketOutlined";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import PageNotFound from "../../WidgetsUI/PageNotFound/pageNotFound";
import Loading from "../../WidgetsUI/Loading/loading";
import Payment from "../Payment/payment";
import CartItem from "../../WidgetsUI/CartItem/cartitem";
import Address from "../../WidgetsUI/Address/address";

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
  addressDialogue: {
    backgroundColor: "#343A40",
  },
  link: {
    color: "#4299e1",
    "&:hover": {
      textDecoration: "underline !important",
      color: "#4299e1",
    },
  },
  addressSubmitControls: {
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
});

class Cart extends Component {
  state = {
    loading: false,
    showAlert: false,
    alert: "",
    severity: "",
    quantity: [],
    showPayment: false,
    selectAddress: false,
    addressTosend: {
      index: 0,
      address: {},
    },
  };

  componentWillMount() {
    this.setState(
      {
        loading: true,
        addressTosend: {
          index: 0,
          address: { ...this.props.user.user.address[0] },
        },
      },
      () => this.props.cartProductList()
    );
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    let showAlert = false,
      alert = "",
      severity = this.state.severity,
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
    if (nextProps.orderHistory.orderAdded?.historyAdded === false) {
      showAlert = true;
      alert = "Something Went Wrong!";
      severity = "error";
    } else if (nextProps.orderHistory.orderAdded?.historyAdded === true) {
      showAlert = true;
      alert = "Payment Successful!";
      severity = "success";
      if (nextProps.cart.cartItems.items.length > 0) {
        this.props.clearCart();
      }
    }
    this.setState({
      loading: false,
      showAlert,
      alert,
      severity,
      quantity,
    });
  }

  componentWillUnmount() {
    this.props.clearCartActions();
    this.props.clearOrderAction();
    this.props.clearCart();
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
        this.state.quantity[i] > item.product.quantity ||
        this.state.quantity[i] <= 0
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

    this.setState({ selectAddress: true });
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

  getConfirmPaymentDetails = (details) => {
    let alert = "",
      severity = this.state.severity;

    if (details.success === false) {
      alert = "Your payment couldn't go through!";
      severity = "error";
      this.setState({ showPayment: false, alert, severity, showAlert: true });
    } else {
      this.setState(
        {
          showPayment: false,
        },
        () =>
          this.props.addOrderHistory(
            details.status.id,
            details.status.order_id,
            this.state.addressTosend.address
          )
      );
    }
  };

  onCheck = (checked, i) => {
    this.setState({
      addressTosend: {
        index: i,
        address: { ...this.props.user.user.address[i] },
      },
    });
  };

  closeAddressDialogue() {
    this.setState({ selectAddress: false });
  }

  renderAddressDialogue() {
    const { selectAddress, addressTosend } = this.state;
    const { classes, user } = this.props;

    return (
      <Dialog
        open={selectAddress}
        classes={{ paper: classes.addressDialogue }}
        fullWidth={true}
        maxWidth={"sm"}
        onClose={() => this.setState({ selectAddress: false })}
      >
        {user.user.address.length === 0 ? (
          <div className="text-xl p-3 text-darktheme-300">
            You don't have any saved addresses.{" "}
            <a href="/user/myprofile" className={classes.link}>
              Click here
            </a>{" "}
            to add an address and place an order!
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="text-lg text-darktheme-200 p-2 box-border pb-1 w-full border-b border-darktheme-400">
              Choose an address or add a new one{" "}
              <a href="/user/myprofile" className={classes.link}>
                here
              </a>
            </div>
            <DialogContent>
              {user.user.address.map((address, i) => {
                return (
                  <Address
                    key={i}
                    details={address}
                    readOnly={true}
                    checkable={true}
                    checked={addressTosend.index === i}
                    onCheck={(checked) => this.onCheck(checked, i)}
                  />
                );
              })}
            </DialogContent>
          </div>
        )}
        <DialogActions>
          <Button
            classes={{ root: classes.addressSubmitControls }}
            onClick={() =>
              this.setState({ showPayment: true, selectAddress: false })
            }
          >
            Proceed To Pay
          </Button>
          <Button
            classes={{ root: classes.addressSubmitControls }}
            onClick={() => this.setState({ selectAddress: false })}
          >
            go back
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const {
      loading,
      showAlert,
      showPayment,
      alert,
      severity,
      quantity,
    } = this.state;
    const { cart, classes } = this.props;

    return (
      <>
        {cart.cartItems?.items && (
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
                      quantity={quantity[i] ? quantity[i] : 0}
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
        {showPayment && (
          <Payment
            closeModal={() => this.setState({ showPayment: false })}
            paymentDone={(details) => this.getConfirmPaymentDetails(details)}
          />
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
        {this.renderAddressDialogue()}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    orderHistory: state.orderhistory,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      changeQuantity,
      cartProductList,
      clearCartActions,
      deleteItem,
      makePayment,
      addOrderHistory,
      clearCart,
      clearOrderAction,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Cart));
