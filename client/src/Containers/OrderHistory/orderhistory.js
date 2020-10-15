import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { getOrderHistory } from "../../actions/orderHistory_actions";
import { bindActionCreators } from "redux";
import moment from "moment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

import PageNotFound from "../../WidgetsUI/PageNotFound/pageNotFound";
import Loading from "../../WidgetsUI/Loading/loading";

const styles = (theme) => ({
  optional: {
    [theme.breakpoints.down(500)]: {
      display: "none",
    },
  },
  collapseBorder: {
    borderCollapse: "collapse !important",
  },
  tableDataSize: {
    [theme.breakpoints.up(500)]: {
      fontSize: "1.125rem !important",
    },
  },
  tdIcon: {
    marginRight: "5px",
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
  evenId: {
    backgroundColor: "#202428",
    "&:hover": { backgroundColor: "#33383D" },
  },
  oddId: {
    backgroundColor: "#202428",
    "&:hover": { backgroundColor: "#33383D" },
  },
});

const tHeads = ["Payment ID", "Order ID", "Total Price", "Date"];

class OrderHistory extends Component {
  state = { loading: false };

  componentWillMount() {
    this.setState({ loading: true });
    this.props.getOrderHistory();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({ loading: false });
  }

  getTotalPrice = (items) => {
    let total = 0;
    items.forEach((item) => (total += item.totalPrice));

    return total;
  };

  renderTableRow = (entry, i) => {
    const { classes } = this.props;

    const tableData = [
      { icon: null, text: entry.paymentID },
      { icon: null, text: entry.orderID },
      {
        icon: <AttachMoneyIcon classes={{ root: classes.tdIcon }} />,
        text: this.getTotalPrice(entry.items),
      },
      {
        icon: <CalendarTodayIcon classes={{ root: classes.tdIcon }} />,
        text: moment(entry.createdAt).format("DD/MM/YYYY"),
      },
    ];

    return (
      <tr
        key={i}
        className={`cursor-pointer text-white border-0 font-sans ${
          i % 2 === 0 ? classes.evenId : classes.oddId
        }`}
        onClick={() =>
          this.props.history.push(`/user/myorders/${entry.paymentID}`)
        }
      >
        {tableData.map((td, i) => (
          <td
            key={i}
            className={`py-3 border-0 ${i === 1 && classes.optional} ${
              classes.td
            }`}
          >
            <div className="flex w-full justify-center items-center">
              <div>{td.icon}</div>
              <div>{td.text}</div>
            </div>
          </td>
        ))}
      </tr>
    );
  };

  render() {
    const { loading } = this.state;
    const { classes } = this.props;

    if (this.props.orderHistory?.orders?.orderHistory === false)
      return (
        <PageNotFound message="Something went wrong and page could not be loaded!" />
      );
    else if (loading) return <Loading />;
    else if (this.props.orderHistory.orders.history.entries.length === 0)
      return (
        <PageNotFound message="You currently don't have any confirmed orders." />
      );

    return (
      <div>
        <div className="pt-3 mx-2 pb-1 text-2xl text-darktheme-200 border-b border-darktheme-400">
          Your Orders
        </div>
        <div className="w-full text-center">
          <table
            className={`mt-4 ${classes.collapseBorder} w-full table-auto bg-darktheme-300 border-0`}
          >
            <thead className="w-full">
              <tr>
                {tHeads.map((th, i) => (
                  <th
                    key={i}
                    className={`py-2 text-black font-sans sm:text-lg smmax:text-sm font-bold ${
                      i === 1 && classes.optional
                    }`}
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="w-full">
              {this.props.orderHistory.orders.history.entries.map((entry, i) =>
                this.renderTableRow(entry, i)
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    orderHistory: state.orderhistory,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ getOrderHistory }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(OrderHistory));
