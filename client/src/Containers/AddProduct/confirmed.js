import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: "#68d391",
    fontSize: 60,
  },
  link: {
    textDecoration: "underline !important",
  },
}));

const Confirmed = () => {
  const classes = useStyles();
  return (
    <div className="w-full mx-auto px-2 text-center">
      <h1 className="text-darktheme-300 text-xl sm:text-3xl md:text-4xl my-4">
        Your product has been successfully uploaded!
      </h1>
      <CheckCircleIcon classes={{ root: classes.icon }} />
      <div className="text-darktheme-200 text-lg mt-4 font-sans font-semibold">
        Check the{" "}
        <span>
          <a href="/user/myproducts" className={classes.link}>
            My Products
          </a>
        </span>{" "}
        section to see it listed!
      </div>
    </div>
  );
};

export default Confirmed;
