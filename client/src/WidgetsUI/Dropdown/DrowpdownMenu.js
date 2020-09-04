import React from "react";
import "./dropdownMenu.css";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";

const DrowpdownMenu = (props) => {
  const getOptions = () => {
    return props.options.map((item, i) => {
      return (
        <Link to={item.link} key={i}>
          <div className="text-lg text-darktheme-200 hover:bg-gray-300 rounded-md hover:text-darktheme-900 p-1">
            {item.text}
          </div>
          {item.divide ? (
            <div className="w-full border my-2 border-gray-700"></div>
          ) : null}
        </Link>
      );
    });
  };

  return (
    <CSSTransition
      in={props.showMenu}
      timeout={100}
      unmountOnExit
      classNames="dropdown-transition"
    >
      <div className="z-30">
        <div
          className="fixed top-0 left-0 w-full h-full opacity-1"
          onClick={() => props.close()}
        ></div>

        <div className="bg-darktheme-800 p-1 box-border rounded-md flex-col h-auto w-32 absolute mt-6 right-0">
          {getOptions()}
        </div>
      </div>
    </CSSTransition>
  );
};

export default DrowpdownMenu;
