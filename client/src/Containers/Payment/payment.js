import Axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { cartProductList } from "../../actions/cart_actions";

import Loading from "../../WidgetsUI/Loading/loading";

const RAZOR_PAY_TEST_KEY = "rzp_test_d3gIhUbFAEGwOd";

class Payment extends Component {
  state = {
    loading: false,
    totalAmount: 0,
    calculated: false,
    paymentSuccess: null,
  };

  componentWillMount() {
    this.setState({ loading: true });
    this.props.cartProductList();
  }

  componentWillReceiveProps(nextProps) {
    let totalAmount = 0;
    if (nextProps.cart.cartItems) {
      nextProps.cart.cartItems.items.forEach(
        (item) => (totalAmount += item.totalPrice)
      );
      this.setState({ totalAmount, calculated: true }, () =>
        this.paymentHandler()
      );
    }
  }

  paymentHandler = async () => {
    const orderUrl = `/api/order?amount=${this.state.totalAmount}`;
    const response = await Axios.get(orderUrl);
    const { user } = this.props.user;
    const { order } = response.data;

    const closeModal = () => {
      this.props.closeModal();
    };

    const options = {
      key: RAZOR_PAY_TEST_KEY,
      name: "B2ME",
      description: "Cart payment",
      order_id: order.id,
      handler: async (response) => {
        this.setState({ loading: true });
        try {
          const paymentId = response.razorpay_payment_id;
          const url = `/api/capture`;
          const captureResponse = await Axios.post(url, {
            paymentId,
            amount: this.state.totalAmount,
          }).then((response) => {
            return response.data;
          });

          this.props.paymentDone(captureResponse);
        } catch (err) {
          console.log(err);
          this.props.paymentDone({ success: false });
        }
        // this.setState({ loading: false });
      },
      prefill: {
        name: `${user.name} ${user.lastname}`,
        email: user.email,
        contact: user.mobile,
      },
      theme: {
        color: "#121212",
      },
      modal: {
        ondismiss: function () {
          closeModal();
        },
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    this.setState({ loading: false });
  };

  render() {
    const { loading } = this.state;

    return <div>{loading && <Loading />}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ cartProductList }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
