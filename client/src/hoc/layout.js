import React from "react";
import Header from "../Components/Header/header";
import Footer from "../Components/Footer/footer";

const Layout = (props) => {
  return (
    <>
      <Header />
      <div className="h-12"></div>
      {props.children}
      <Footer />
    </>
  );
};

export default Layout;
