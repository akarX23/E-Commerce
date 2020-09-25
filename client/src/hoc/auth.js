import React, { Component } from "react";
import { connect } from "react-redux";
import { auth } from "../actions/user_actions";
import { bindActionCreators } from "redux";
import AuthRevoked from "../Components/AuthRevoked/authrevoked";
import Loading from "../WidgetsUI/Loading/loading";

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

      if (
        !nextProps.user.user.isAuth &&
        (authAdmin === true || authUser === true)
      ) {
        this.props.history.push("/");
      } else {
        if (authAdmin === true && nextProps.user.user.role === 0)
          this.setState({ authRevoke: true });
        else if (authAdmin === false && authUser === false)
          this.props.history.push("/user");
      }
    }

    render() {
      if (this.state.loading) return <Loading />;
      if (this.state.authRevoke) return <AuthRevoked />;
      return (
        <ComposedClass
          user={this.props.user.user}
          history={this.props.history}
          queries={this.props.match.params}
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
