import React, { Component } from "react";
import { connect } from "react-redux";
import { auth } from "../actions/user_actions";
import { bindActionCreators } from "redux";
import AuthRevoked from "../Components/AuthRevoked/authrevoked";

export default function (ComposedClass, authUser, authAdmin) {
  class AuthenticationCheck extends Component {
    state = {
      loading: true,
      authRevoke: false,
    };

    componentWillMount() {
      this.props.auth();
    }

    componentWillReceiveProps(nextProps) {
      this.setState({ loading: false });

      if (!nextProps.user.user.isAuth) {
        if (authAdmin || authUser) this.props.history.push("/login");
      } else {
        if (authAdmin && nextProps.user.user.role === 0)
          this.setState({ authRevoke: true });
        if (authAdmin === false && authUser === false)
          this.props.history.push("/user");
      }
    }

    render() {
      if (this.state.loading) return <div className="loader"></div>;
      if (this.state.authRevoke) return <AuthRevoked />;
      return (
        <ComposedClass
          user={this.props.user.user}
          history={this.props.history}
        />
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };

  const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({ auth }, dispatch),
  });

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticationCheck);
}
