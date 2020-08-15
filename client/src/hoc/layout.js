import React from "react";
import Header from "../Components/header";
import Footer from "../Components/footer";

const Layout = (props) => {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
};

export default Layout;
