import React from "react";
import Button from "@material-ui/core/Button";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  viewFull: {
    width: "150px",
    outline: "none !important",
    border: "none !important",
    backgroundColor: "#2c7a7b",
    color: "white",
    "&:hover": {
      backgroundColor: "#285e61",
    },
  },
  fullImage: {
    width: "50%",
    height: "60%",
    minHeight: "350px",
    minWidth: "350px",
    [theme.breakpoints.down(420)]: {
      width: "100%",
    },
  },
  crossContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#202428",
    borderRadius: "10px",
  },
  cross: {
    color: "white",
    fontSize: 30,
    outline: "none !important",
    border: "none !important",
  },
}));

const ViewFullImage = ({ closeImage, image, openState, open }) => {
  const classes = useStyles();

  const setScroll = (visible) => {
    if (visible) document.body.style.overflow = "auto";
    else document.body.style.overflow = "hidden";
    return;
  };

  return (
    <>
      {setScroll(image && openState === true ? false : true)}
      {image && (
        <>
          <Button
            variant="contained"
            classes={{ root: classes.viewFull }}
            startIcon={<FullscreenIcon fontSize="large" />}
            onClick={() => open()}
          >
            View Image
          </Button>
          {openState === true ? (
            <div className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-75">
              <div className={classes.crossContainer}>
                <IconButton classes={{ root: classes.cross }}>
                  <ClearIcon />
                </IconButton>
              </div>
              <ClickAwayListener onClickAway={closeImage}>
                <div className={classes.fullImage}>
                  <img
                    src={image}
                    className="object-cover object-center w-full h-full"
                    alt="full-image"
                  />
                </div>
              </ClickAwayListener>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default ViewFullImage;
