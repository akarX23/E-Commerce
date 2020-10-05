import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { userProductList, deleteProducts } from "../../actions/product_actions";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import SelectAllIcon from "@material-ui/icons/SelectAll";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import Checkbox from "@material-ui/core/Checkbox";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import PageNotFound from "../../WidgetsUI/PageNotFound/pageNotFound";
import Loading from "../../WidgetsUI/Loading/loading";
import ProductCard from "../../WidgetsUI/ProductCart/productCard";
import Search from "../../WidgetsUI/Search/search";

const styles = (theme) => ({
  select: {
    backgroundColor: "#dd6b20",
    "&:hover": {
      backgroundColor: "#ed8936",
    },
    color: "white !important",
    transition: "all ease-in 0.4s",
    outline: "none !important",
    border: "none !important",
    paddingLeft: "10px",
    [theme.breakpoints.down(420)]: {
      fontSize: "10px",
    },
    fontSize: "13px",
  },
  delete: {
    backgroundColor: "#c53030",
    "&:hover": {
      backgroundColor: "#9b2c2c",
    },
    color: "white !important",
    transition: "all ease-in 0.4s",
    outline: "none !important",
    border: "none !important",
    paddingLeft: "10px",
    [theme.breakpoints.down(420)]: {
      fontSize: "10px",
    },
  },
  checkBox: {
    color: "#D2D8DD",
    "&$checked": {
      color: "#D2D8DD",
    },
  },
  checkedCheckBox: {},
  editProduct: {
    outline: "none !important",
    border: "none !important",
    marginTop: "15px",
    width: "100px",
    color: "white !important",
  },
  submit: {
    color: "#fff",
    fontSize: "13px",
    transition: "ease-in 0.4s all",
    backgroundColor: "#202428 !important",
    letterSpacing: "2px",
    marginLeft: "10px",
    outline: "none !important",
    border: "none !important",
  },
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
  tooltip: {
    backgroundColor: "black",
    maxWidth: "250px",
    fontSize: "14px",
  },
  arrowTooltip: {
    color: "black",
  },
  deleteDialogue: {
    backgroundColor: "#343A40",
  },
  deleteDialogueTitle: {
    color: "#EAEDF0",
    fontSize: "19px",
  },
  deleteDialogueButtons: {
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

class MyProduct extends Component {
  state = {
    loading: false,
    productList: [],
    checked: [],
    searchArray: [],
    options: [],
    numberOfProducts: 0,
    deleteDialogue: false,
    showAlert: false,
    severity: "",
    alert: "",
  };

  componentWillMount() {
    this.setState({ loading: true });
    this.props.userProductList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product.userProducts) {
      let checked = [],
        productList = [],
        options = [],
        numberOfProducts = 0,
        tags = [],
        showAlert = false,
        alert = "",
        severity = "";

      if (nextProps.product.userProducts.list === true) {
        nextProps.product.userProducts.products.forEach((product) => {
          checked.push(false);
          options.push(product.title);
          product.tags.forEach((tag) => tags.push("#" + tag));
          numberOfProducts += 1;
        });

        if (nextProps.product.userProducts.deleted === true) {
          showAlert = true;
          alert = "Products deleted!";
          severity = "success";
        } else if (nextProps.product.userProducts.deleted === false) {
          showAlert = true;
          alert = "Something went wrong. Try again.";
          severity = "error";
        }

        productList = [...nextProps.product.userProducts.products];
        options = [...options, ...tags];
        options = [...new Set(options)];
      } else if (nextProps.product.userProducts.list === false) {
        showAlert = true;
        alert = "Something went wrong. We could not fetch your products.";
        severity = "error";
      }

      this.setState({
        loading: false,
        productList: [...nextProps.product.userProducts.products],
        checked,
        options,
        numberOfProducts,
        showAlert,
        alert,
        severity,
      });
    }
  }

  checkProduct = (checkState, i) => {
    let newCheckState = [...this.state.checked];
    newCheckState[i] = checkState;

    this.setState({ checked: [...newCheckState] });
  };

  changeAllCheckState = (newState) => {
    let newCheckState = [...this.state.checked];
    newCheckState.forEach((state, i) => (newCheckState[i] = newState));

    this.setState({ checked: [...newCheckState] });
  };

  handleOnSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    let productList = this.props.product.userProducts.products;
    let checked = [];

    const regex = this.state.searchArray.map((searchItem) => {
      searchItem =
        searchItem[0] === "#"
          ? searchItem.substring(1, searchItem.length)
          : searchItem;
      return new RegExp(searchItem, "i");
    });

    if (this.state.searchArray.length > 0) {
      productList = productList.filter((product) => {
        if (
          regex.some((rx) => rx.test(product.title)) === true ||
          product.tags.some((tag) => regex.some((rx) => rx.test(tag))) === true
        ) {
          checked.push(false);
          return true;
        }
        return false;
      });
    } else productList.forEach((product) => checked.push(false));

    productList.forEach((newProduct, i) => {
      this.state.productList.forEach((product, j) => {
        if (product._id === newProduct._id) checked[i] = this.state.checked[j];
      });
    });

    this.setState({ checked, productList, loading: false });
  };

  sendDeleteRequest = () => {
    let deleteProducts = [];
    this.state.productList.forEach((product, i) => {
      if (this.state.checked[i] === true) deleteProducts.push(product);
    });
    this.setState({
      loading: true,
      deleteDialogue: !this.state.deleteDialogue,
    });
    this.props.deleteProducts(deleteProducts);
  };

  toggleDeleteDialogue = () => {
    this.setState({ deleteDialogue: !this.state.deleteDialogue });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        {this.props.product.userProducts && (
          <div className="w-full p-4">
            {this.props.product.userProducts.list === false ||
            this.props.product.userProducts.products.length !== 0 ? (
              <>
                <div className="flex flex-col w-full text-darktheme-200">
                  <div className="text-3xl font-medium font-sans">
                    My Products
                  </div>
                  <div className="text-lg font-sans mt-2">
                    Here you can view, edit, delete your products.
                  </div>
                </div>
                <div className="w-full flex justify-around items-start my-3 py-3 border-t border-b border-darktheme-400">
                  <Button
                    startIcon={<SelectAllIcon />}
                    classes={{ root: classes.select }}
                    onClick={() => this.changeAllCheckState(true)}
                  >
                    select all
                  </Button>
                  <Button
                    startIcon={<CancelPresentationIcon />}
                    classes={{ root: classes.select }}
                    onClick={() => this.changeAllCheckState(false)}
                  >
                    unselect all
                  </Button>
                  <Button
                    startIcon={<DeleteSweepIcon />}
                    classes={{ root: classes.delete }}
                    onClick={() => this.toggleDeleteDialogue()}
                  >
                    delete
                  </Button>
                </div>
                <form
                  className={`w-full justify-center items-stretch flex my-2`}
                  onSubmit={(event) => this.handleOnSubmit(event)}
                >
                  <Search
                    placeholder={`Search ${this.state.numberOfProducts} products...`}
                    autoComplete={classes.autoComplete}
                    value={this.state.searchArray}
                    classes={classes}
                    handleValueChange={(searchArray) =>
                      this.setState({ searchArray })
                    }
                    options={this.state.options}
                  />
                  <Button
                    variant="contained"
                    classes={{
                      root: classes.submit,
                    }}
                    size="small"
                    type="submit"
                    onSubmit={(event) => this.handleOnSubmit(event)}
                  >
                    Search
                  </Button>
                </form>
                <div className="mx-auto gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
                  {this.state.productList.map((product, i) => (
                    <div
                      key={i}
                      className="w-auto justify-center items-start flex my-3"
                    >
                      <Checkbox
                        classes={{
                          root: classes.checkBox,
                          checked: classes.checkedCheckBox,
                        }}
                        color="default"
                        checkedIcon={<CheckCircleIcon />}
                        checked={this.state.checked[i]}
                        onChange={(event) =>
                          this.checkProduct(event.target.checked, i)
                        }
                        defaultValue={false}
                      />
                      <div className="flex flex-col items-center justify-between">
                        <ProductCard
                          {...product}
                          noTags={true}
                          noExpand={true}
                        />
                        <Button
                          color="secondary"
                          variant="contained"
                          classes={{ root: classes.editProduct }}
                          startIcon={<EditIcon />}
                          href={`/product/edit/${product._id}`}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <PageNotFound message="You currenntly have no listed products" />
            )}
          </div>
        )}
        {this.state.loading === true && <Loading />}
        <Snackbar
          open={this.state.showAlert}
          autoHideDuration={3000}
          onClose={() => this.setState({ showAlert: false })}
        >
          <Alert variant="filled" severity={this.state.severity}>
            {this.state.alert}
          </Alert>
        </Snackbar>
        <Dialog
          open={this.state.deleteDialogue}
          onClose={() => this.toggleDeleteDialogue()}
          classes={{ paper: classes.deleteDialogue }}
        >
          <DialogTitle classes={{ root: classes.deleteDialogueTitle }}>
            Are you sure you want to delete the selected products?
          </DialogTitle>
          <DialogActions>
            <Button
              classes={{ root: classes.deleteDialogueButtons }}
              onClick={() => this.sendDeleteRequest()}
            >
              Yes
            </Button>
            <Button
              classes={{ root: classes.deleteDialogueButtons }}
              onClick={() => this.toggleDeleteDialogue()}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    product: state.product,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ userProductList, deleteProducts }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MyProduct));
