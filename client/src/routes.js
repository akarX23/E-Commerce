import React from "react";
import { Switch, Route } from "react-router-dom";

//HOC
import Layout from "./hoc/layout";
import Auth from "./hoc/auth";

//COMPONENTS
import Home from "./Containers/Home/home";
import Product from "./Containers/Product/product";

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/product/:id" exact component={Auth(Product)} />
        <Route path="/" component={Auth(Home)} />
      </Switch>
    </Layout>
  );
};

export default Routes;
