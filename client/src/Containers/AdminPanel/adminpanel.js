import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  getUsersList,
  addUserByAdmin,
  clearAdminActions,
  promoteUser,
  deleteUser,
} from "../../actions/user_actions";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Loading from "../../WidgetsUI/Loading/loading";
import PageNotFound from "../../WidgetsUI/PageNotFound/pageNotFound";
import UserCard from "../../WidgetsUI/UserCard/usercard";
import SignUpForm from "../../Components/Forms/signUpForm";
import Modal from "../../WidgetsUI/Modal/modal";

const styles = (theme) => ({
  addUser: {
    outline: "none !important",
    border: "none !important",
    [theme.breakpoints.down(430)]: {
      fontSize: "12px",
    },
    transition: "all 0.5s linear",
  },
  sort: {
    color: "white",
    paddingLeft: "13px",
    backgroundColor: "#202428 !important",
    width: "70px",
    fontSize: "18px",
    padding: "10px",
    transition: "all 0.5s linear",
    [theme.breakpoints.down(430)]: {
      width: "50px",
      fontSize: "14px",
    },
  },
  sortMenu: {
    backgroundColor: "#32383E",
    boxShadow: "0 0 4px 3px #000",
    marginTop: "5px",
  },
  sortMenuItem: {
    color: "#D2D8DD !important",
    "&:hover": {
      backgroundColor: "#202428 !important",
    },
  },
  icon: {
    color: "#C3C9D0",
    transform: "rotate(0deg)",
    transition: "all 0.4s linear",
  },
  iconOpen: {
    transform: "rotate(180deg)",
  },
  selectedSort: {
    backgroundColor: "#1a202c !important",
  },
  textField: {
    backgroundColor: "#202428",
    borderRadius: "5px",
    width: "60%",
    [theme.breakpoints.down(600)]: {
      width: "90%",
    },
    transition: "all 0.5s linear",
  },
  inputRoot: {
    color: "white",
    padding: "3px",
    fontSize: "15px",
    [theme.breakpoints.down(430)]: {
      fontSize: "13px",
    },
    transition: "all 0.5s linear",
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
  accordion: {
    backgroundColor: "#121212",
    width: "100%",
    boxShadow: "0 0 2px #4a5568",
    marginTop: "20px",
  },
  expandIcon: {
    color: "white",
  },
  deleteDialogue: {
    backgroundColor: "#343A40",
  },
  deleteDialogueTitle: {
    color: "#EAEDF0",
    fontSize: "19px",
    fontFamily: "sans",
  },
  deleteConfirmControls: {
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

class UserList extends Component {
  state = {
    loading: false,
    role: 2,
    roleTypes: ["Users", "Admins", "All"],
    searchValue: "",
    userList: [],
    adminList: [],
    showAlert: false,
    alert: "",
    severity: "",
    adminExpanded: false,
    userExpanded: true,
    showSignUpModal: false,
    deleteConfirmDialog: false,
    idToDelete: "",
  };

  changeDisplayList = (role) => {
    let userList = this.getNewLists(this.state.searchValue, role, 0);
    let adminList = this.getNewLists(this.state.searchValue, role, 1);

    this.setState({ role, userList, adminList });
  };

  handleSearchChange = (searchValue) => {
    let userList = this.getNewLists(searchValue, this.state.role, 0);
    let adminList = this.getNewLists(searchValue, this.state.role, 1);

    this.setState({
      searchValue,
      userList,
      adminList,
      adminExpanded: true,
      userExpanded: true,
    });
  };

  getFilteredItems = (regex, userRole) => {
    let newList = [];
    this.props.users.userList.users.forEach((user) => {
      if (
        (regex.some((rx) => rx.test(user.name)) ||
          regex.some((rx) => rx.test(user.lastname))) &&
        userRole === user.role
      )
        newList.push(user);
    });
    return newList;
  };

  getNewLists = (search, roleToDisplay, userRole) => {
    let newList = [];

    if (roleToDisplay === 2 || roleToDisplay === userRole) {
      const regex = search.split(" ").map((item) => new RegExp(item, "i"));
      newList = [...this.getFilteredItems(regex, userRole)];
    }

    return newList;
  };

  promoteUser = (id) => {
    this.setState({ loading: true }, () => this.props.promoteUser(id));
  };

  deleteUser = (id) => {
    this.setState({ deleteConfirmDialog: true, idToDelete: id });
  };

  deleteUserConfirm = () => {
    this.setState({ deleteConfirmDialog: false, loading: true }, () =>
      this.props.deleteUser(this.state.idToDelete)
    );
  };

  submitUserDetails = (data) => {
    this.setState({ loading: true, showSignUpModal: false }, () =>
      this.props.addUserByAdmin(data)
    );
  };

  componentWillMount() {
    this.setState({ loading: true }, () => this.props.getUsersList());
  }

  componentWillReceiveProps(nextProps) {
    let userList = [],
      adminList = [],
      severity = "",
      alert = "",
      showAlert = false;
    if (nextProps.users.userList) {
      let list = nextProps.users.userList;
      if (list.list === false) {
        severity = "error";
        alert = "Something went wrong!";
        showAlert = true;
      }
      if (nextProps.users.adminActions) {
        console.log(nextProps);
        showAlert = true;
        let action = nextProps.users.adminActions;
        if (action.success === false) {
          if (action.found === true) {
            severity = "warning";
            alert = "This user has already been registered with us!";
          } else {
            severity = "error";
            alert = "Something went wrong. Please try again!";
          }
        } else {
          severity = "success";
          if (action.added) {
            alert = "User added successfully";
            list.users.push(action.user);
          } else if (action.promoted) {
            alert = "User Promoted";
            list.users.forEach((user, i) => {
              if (user._id === action.user._id)
                list.users[i] = { ...user, role: 1 };
            });
          } else if (action.deleted) {
            alert = "User Deleted!";
            list.users = list.users.filter(
              (user) => user._id !== action.user._id
            );
          }
        }
      }
      list.users.forEach((user) => {
        if (user.role === 0) userList.push(user);
        else adminList.push(user);
      });
    }
    this.setState({
      userList,
      loading: false,
      showAlert,
      severity,
      alert,
      adminList,
    });
  }

  componentWillUnmount() {
    this.props.clearAdminActions();
  }

  renderList = (list, title) => {
    const { classes } = this.props;
    const state = title === "Admins" ? "adminExpanded" : "userExpanded";
    return (
      <Accordion
        classes={{ root: classes.accordion }}
        TransitionProps={{ unmountOnExit: true }}
        expanded={this.state[state]}
        onChange={(event, expanded) => this.setState({ [state]: expanded })}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon classes={{ root: classes.expandIcon }} />}
        >
          <div className="text-xl mb:text-2xl text-darktheme-300">{title}</div>
        </AccordionSummary>
        <div className="w-full px-2 text-center">
          <div className="border-b border-darktheme-400 w-full"></div>
        </div>
        <AccordionDetails>
          <div className="grid sm:grid-cols-2 w-full smmax:grid-cols-1 gap-6">
            {list.map((user, i) => (
              <div className="w-full mt-3" key={i}>
                <UserCard
                  {...user}
                  promote={(id) => this.promoteUser(id)}
                  deleteUser={(id) => this.deleteUser(id)}
                />
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    );
  };

  renderDeleteDialog = () => {
    const { classes } = this.props;
    return (
      <Dialog
        open={this.state.deleteConfirmDialog}
        onClose={() => this.setState({ deleteConfirmDialog: false })}
        classes={{ paper: classes.deleteDialogue }}
      >
        <DialogTitle classes={{ root: classes.deleteDialogueTitle }}>
          Are you sure you want to delete this user ?
        </DialogTitle>
        <DialogActions>
          <Button
            classes={{ root: classes.deleteConfirmControls }}
            onClick={() => this.deleteUserConfirm()}
          >
            Yes
          </Button>
          <Button
            classes={{ root: classes.deleteConfirmControls }}
            onClick={() => this.setState({ deleteConfirmDialog: false })}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    const { classes } = this.props;
    const { role, roleTypes, searchValue, userList, adminList } = this.state;

    return (
      <>
        <div className="p-4">
          {this.props.users.userList && (
            <>
              <div className="w-full mb-3 text-center pb-1 border-b text-4xl text-darktheme-300 border-darktheme-300">
                ADMIN PANEL
                <div className="text-darktheme-200 text-sm mbmax:text-left w-full">
                  Being an admin your actions cannot be reversed. So please make
                  sure to think about your actions before executing them!
                </div>
              </div>
              <div className="w-full text-center">
                <TextField
                  placeholder={`Search a user...`}
                  className={classes.textField}
                  value={searchValue}
                  onChange={(event) =>
                    this.handleSearchChange(event.target.value)
                  }
                  size="small"
                  variant="outlined"
                  color="primary"
                  InputProps={{
                    autoComplete: "new-password",
                    startAdornment: (
                      <>
                        <InputAdornment
                          position="start"
                          className={classes.searchIcon}
                        >
                          <SearchIcon />
                        </InputAdornment>
                      </>
                    ),
                    classes: {
                      root: classes.inputRoot,
                      notchedOutline: classes.inputNotched,
                    },
                  }}
                />
              </div>
              <div className="w-full flex justify-evenly items-stretch mt-3">
                <div className="flex items-center w-auto mr-3">
                  <div className="mb:text-2xl mbmax:text-lg text-darktheme-200 mr-4">
                    Show :{" "}
                  </div>
                  <TextField
                    select
                    value={role}
                    onChange={(event) =>
                      this.changeDisplayList(event.target.value)
                    }
                    variant="outlined"
                    SelectProps={{
                      classes: {
                        root: classes.sort,
                        icon: classes.icon,
                        iconOpen: classes.iconOpen,
                      },
                      MenuProps: {
                        classes: {
                          paper: classes.sortMenu,
                        },
                        disablePortal: true,
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "right",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "right",
                        },
                        getContentAnchorEl: null,
                      },
                    }}
                  >
                    {roleTypes.map((type, i) => (
                      <MenuItem
                        value={i}
                        key={i}
                        classes={{
                          root: classes.sortMenuItem,
                          selected: classes.selectedSort,
                        }}
                      >
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  classes={{ root: classes.addUser }}
                  startIcon={<PersonAddIcon />}
                  onClick={() => this.setState({ showSignUpModal: true })}
                >
                  Add User
                </Button>
              </div>
              {adminList.length > 0 && this.renderList(adminList, "Admins")}
              {userList.length > 0 ? (
                this.renderList(userList, "Users")
              ) : (
                <>
                  {this.state.role !== 1 && (
                    <div className="mt-3">
                      <PageNotFound message="No users found" />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
        {this.state.loading === true && <Loading />}
        <Snackbar
          open={this.state.showAlert}
          autoHideDuration={5000}
          onClose={() => this.setState({ showAlert: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="filled"
            severity={this.state.severity}
            onClose={() => this.setState({ showAlert: false })}
          >
            {this.state.alert}
          </Alert>
        </Snackbar>
        <Modal
          title="Add User"
          showModal={this.state.showSignUpModal}
          hideModal={() => {
            this.setState({ showSignUpModal: false });
          }}
        >
          <SignUpForm
            signup={(data) => this.submitUserDetails(data)}
            adminSignUp={true}
          />
        </Modal>
        {this.renderDeleteDialog()}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      getUsersList,
      addUserByAdmin,
      clearAdminActions,
      promoteUser,
      deleteUser,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UserList));
