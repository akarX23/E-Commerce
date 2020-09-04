import React from "react";
import Header from "../Components/Header/header";
import Footer from "../Components/Footer/footer";

const Layout = (props) => {
  return (
    <>
      <Header />
      <div className="pt-16"></div>
      {props.children}
      <Footer />
    </>
  );
};

export default Layout;
