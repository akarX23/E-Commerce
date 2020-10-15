import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { deleteUser, clearAdminActions } from "../../actions/user_actions";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import Loading from "../../WidgetsUI/Loading/loading";

const styles = (theme) => ({
  confirm: {
    marginRight: "20px",
    outline: "none !important",
    border: "none !important",
  },
  decline: {
    outline: "none !important",
    border: "none !important",
  },
});

class UserDelete extends Component {
  state = { loading: false, showAlert: false };

  confirmDelete = () => {
    console.log(this.props);
    this.setState({ loading: true }, () => {
      this.props.deleteUser(this.props.user.user.id);
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.adminActions) {
      let showAlert = false;
      let action = nextProps.user.adminActions;
      if (action.success === false) {
        showAlert = true;
      } else {
        this.props.history.push("/");
      }
      this.setState({ loading: true, showAlert });
    }
  }

  componentWillUnmount() {
    this.props.clearAdminActions();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <div className="w-full text-2xl text-darktheme-200 my-2 pb-1 border-b border-darktheme-400">
          Deleting your account will delete all your products as well and there
          is no way to recover them. Are you sure you want to continue?
        </div>
        <div className="flex">
          <Button
            variant="contained"
            color="secondary"
            classes={{ root: classes.confirm }}
            onClick={() => this.confirmDelete()}
          >
            Yes
          </Button>
          <Button
            variant="contained"
            color="primary"
            classes={{ root: classes.decline }}
            onClick={() => this.props.history.push("/")}
          >
            No
          </Button>
        </div>
        {this.state.loading && <Loading />}
        <Snackbar
          open={this.state.showAlert}
          autoHideDuration={5000}
          onClose={() => this.setState({ showAlert: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="filled"
            severity="error"
            onClose={() => this.setState({ showAlert: false })}
          >
            Something went wrong. Please try again!
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      deleteUser,
      clearAdminActions,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UserDelete));
