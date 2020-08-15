import React from "react";
import { Switch, Route } from "react-router-dom";

//HOC
import Layout from "./hoc/layout";

//COMPONENTS
import Home from "./Containers/home";

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={Home} />
      </Switch>
    </Layout>
  );
};

export default Routes;
