import React from "react";

const PageNotFound = (props) => {
  return (
    <div className="w-11/12 h-full p-3 bg-darktheme-900 rounded-lg text-4xl mx-auto flex justify-center items-center text-darktheme-300 font-semibold font-mono">
      {props.message}
    </div>
  );
};

export default PageNotFound;
