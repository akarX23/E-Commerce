import React from "react";
import "./itemLoading.css";
import PlaylistAddCheckRoundedIcon from "@material-ui/icons/PlaylistAddCheckRounded";

const ItemLoading = ({ allLoaded }) => {
  return (
    <div className="w-full pt-4 box-border">
      {allLoaded === false ? (
        <div className="w-12 h-12 rounded-full mx-auto itemloading animate-spin"></div>
      ) : (
        <div className="w-full h-auto flex justify-center bg-darktheme-900 bg-opacity-75 items-center">
          <PlaylistAddCheckRoundedIcon
            style={{ fontSize: 40, color: "#68D391" }}
          />
          <div className="text-lg ml-2 text-green-400 font-mono">
            These are all the products for you!
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemLoading;
