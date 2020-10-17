import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { getHistoryItem } from "../../actions/orderHistory_actions";
import { bindActionCreators } from "redux";
import moment from "moment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

import PageNotFound from "../../WidgetsUI/PageNotFound/pageNotFound";
import Loading from "../../WidgetsUI/Loading/loading";
import Input from "../../WidgetsUI/InputUI/input";
import Address from "../../WidgetsUI/Address/address";

const styles = (theme) => ({
  textField: {
    backgroundColor: "#202428",
    borderRadius: "5px",
    width: "100%",
  },
  inputRoot: {
    color: "white",
    fontSize: "17px",
    fontFamily: "sans",
  },
  icon: {
    marginLeft: "-5px",
    height: "100%",
    marginRight: 5,
  },
  tdIcon: {
    [theme.breakpoints.down(500)]: {
      fontSize: "15px",
    },
    fontSize: "17px",
    padding: 0,
  },
  td: {
    [theme.breakpoints.down(500)]: {
      fontSize: "13px",
    },
    fontSize: "17px",
  },
  titleHead: {
    width: "50%",
  },
  otherHeads: {
    width: "auto",
  },
});

class HistoryItem extends Component {
  state = { loading: false };

  componentWillMount() {
    this.setState({ loading: true }, () =>
      this.props.getHistoryItem(this.props.queries.payid)
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: false });
  }

  getTotalPrice = (items) => {
    let total = 0;
    items.forEach((item) => (total += item.totalPrice));

    return total;
  };

  renderTableRow = (item, i) => {
    const { classes } = this.props;

    const tableData = [
      { icon: null, text: item.product.title },
      {
        icon: <AttachMoneyIcon classes={{ root: classes.tdIcon }} />,
        text: item.product.price,
      },
      {
        icon: null,
        text: item.quantity,
      },
      {
        icon: <AttachMoneyIcon classes={{ root: classes.tdIcon }} />,
        text: item.totalPrice,
      },
    ];

    return (
      <tr
        key={i}
        className={`cursor-pointer text-white border-0 font-sans bg-darktheme-900 hover:bg-darktheme-800`}
        onClick={() => this.props.history.push(`/product/${item.product._id}`)}
      >
        {tableData.map((td, i) => (
          <td key={i} className={`py-3 border-0 ${classes.td} px-1`}>
            <div className="flex w-full justify-center items-center">
              <div>{td.icon}</div>
              <div>{td.text}</div>
            </div>
          </td>
        ))}
      </tr>
    );
  };

  renderHistoryItems = (items) => {
    const tHeads = ["Title", "Cost", "Quantity", "Total"];
    const { classes } = this.props;

    return (
      <div className="w-full">
        <table
          className={`mt-3 text-center w-full table-fixed bg-darktheme-300 border-0`}
        >
          <thead className="w-full">
            <tr>
              {tHeads.map((th, i) => (
                <th
                  key={i}
                  className={`py-2 ${
                    i === 0 ? classes.titleHead : classes.otherHeads
                  } text-black font-sans sm:text-lg smmax:text-sm font-bold `}
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="w-full">
            {items.map((item, i) => {
              return this.renderTableRow(item, i);
            })}
          </tbody>
        </table>
      </div>
    );
  };

  render() {
    const { loading } = this.state;
    const { orderHistory, classes } = this.props;
    let item = orderHistory.historyItem?.historyItem;

    if (orderHistory.historyItem?.found === false)
      return <PageNotFound message="This page doesn't exist!" />;

    return (
      <>
        {item ? (
          <div className="w-full -mt-4 flex flex-col items-center">
            <div className="flex w-full sm:p-5 justify-between smmax:justify-center flex-wrap">
              <div className="w-2/5 smmax:w-4/5">
                <Input
                  label="Payment ID"
                  classes={classes}
                  value={item.paymentID}
                  readonly={true}
                />
              </div>
              <div className="w-2/5 smmax:w-4/5">
                <Input
                  label="Order ID"
                  classes={classes}
                  value={item.orderID}
                  readonly={true}
                />
              </div>
            </div>
            <div className="w-full sm:p-5 flex smmax:justify-center">
              <div className="w-full smmax:w-4/5 flex flex-col mt-8 items-start">
                <div className={`text-darktheme-200 w-auto mb:text-xl`}>
                  Address
                </div>
                <Address details={item.address} readOnly={true} />
              </div>
            </div>
            <div className="w-full sm:p-5 smmax:w-4/5 flex justify-between">
              <div className="w-1/2">
                <Input
                  label="Date"
                  classes={classes}
                  value={moment(item.createdAt).format("DD/MM/YYYY")}
                  readonly={true}
                  Icon={CalendarTodayIcon}
                />
              </div>
              <div className="w-2/5">
                <Input
                  label="Total Price"
                  classes={classes}
                  value={this.getTotalPrice(item.items)}
                  readonly={true}
                  Icon={AttachMoneyIcon}
                />
              </div>
            </div>
            <div className="w-full pb-1 pl-4 mt-3 border-b border-darktheme-400 text-xl text-darktheme-200">
              Items you ordered
            </div>
            <div className="my-2 px-2 text-darktheme-500 text-sm">
              The details shown below are of the time you ordered this product.
              The product might have been deleted or updated by the owner.
            </div>
            {this.renderHistoryItems(item.items)}
          </div>
        ) : null}
        {loading && <Loading />}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    orderHistory: state.orderhistory,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ getHistoryItem }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(HistoryItem));
