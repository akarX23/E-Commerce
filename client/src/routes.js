import React from "react";
import { Switch, Route } from "react-router-dom";

//HOC
import Layout from "./hoc/layout";
import Auth from "./hoc/auth";

//COMPONENTS
import Home from "./Containers/Home/home";
import Product from "./Containers/Product/product";
import Test from "./Containers/Test/test";
import AddProduct from "./Containers/AddProduct/addproduct";
import EmailConfirmation from "./Containers/EmailConfirmation/emailconfirmation";
import RequestVerification from "./Containers/RequestVerification/requestverification";
import ForgotPassword from "./Containers/ForgotPassword/forgotpassword";
import ResetPasword from "./Containers/ResetPassword/resetpassword";
import ProfileDisplayAndEdit from "./Containers/ProfileDisplayAndEdit/profiledisplayandedit";
import MyProducts from "./Containers/MyProducts/myproducts";
import EditProduct from "./Containers/EditProduct/editproduct";
import AdminPanel from "./Containers/AdminPanel/adminpanel";
import UserDelete from "./Containers/UserDelete/userDelete";
import Cart from "./Containers/Cart/cart";
import Payment from "./Containers/Payment/payment";

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/user/forgot" exact component={Auth(ForgotPassword)} />
        <Route
          path="/user/reset/:id/:token"
          exact
          component={Auth(ResetPasword)}
        />
        <Route
          path="/user/delete"
          exact
          component={Auth(UserDelete, true, false)}
        />
        <Route
          path="/user/payment"
          exact
          component={Auth(Payment, true, false)}
        />
        <Route path="/user/cart" exact component={Auth(Cart, true, false)} />
        <Route
          path="/user/requestverification"
          exact
          component={Auth(RequestVerification)}
        />
        <Route
          path="/user/myproducts"
          exact
          component={Auth(MyProducts, true, false)}
        />
        <Route
          path="/user/confirm/:id/:token"
          exact
          component={Auth(EmailConfirmation)}
        />
        <Route
          path="/user/addproduct"
          exact
          component={Auth(AddProduct, true, false)}
        />
        <Route
          path="/user/myprofile"
          exact
          component={Auth(ProfileDisplayAndEdit, true, false)}
        />
        <Route path="/admin" exact component={Auth(AdminPanel, true, true)} />
        <Route
          path="/product/edit/:id"
          exact
          component={Auth(EditProduct, true, false)}
        />
        <Route path="/product/:id" exact component={Auth(Product)} />
        <Route path="/test" exact component={Test} />
        <Route path="/" component={Auth(Home)} />
      </Switch>
    </Layout>
  );
};

export default Routes;
