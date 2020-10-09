import React from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      height: "auto",
      maxWidth: "350px",
    },
    outline: "none !important",
    border: "none !important",
    height: "200px",
  },
  content: {
    padding: "0px",
  },
  actions: {
    diplay: "flex",
    justifyContent: "space-around",
  },
  deleteUser: {
    outline: "none !important",
    border: "none !important",
    backgroundColor: "#c53030",
    "&:hover": { backgroundColor: "#9b2c2c" },
    fontSize: "12px",
    color: "white",
    [theme.breakpoints.down(500)]: {
      fontSize: "11px",
    },
    fontWeight: "500",
  },
  promote: {
    outline: "none !important",
    border: "none !important",
    fontSize: "12px",
    fontWeight: "500",
    [theme.breakpoints.down(500)]: {
      fontSize: "11px",
    },
  },
  image: {
    [theme.breakpoints.down("sm")]: {
      height: "250px",
    },
  },
}));

const userImage =
  "https://res.cloudinary.com/b2me/image/upload/v1602248889/productImages/kjefqctstrnawl9tgsun.png";

const UserCard = ({
  name,
  lastname,
  imageURL,
  updatedAt,
  createdAt,
  email,
  role,
  mobile,
  _id,
  promote,
  deleteUser,
}) => {
  const classes = useStyles();

  return (
    <div>
      <Card classes={{ root: classes.root }}>
        <div className={`w-full ${classes.image}`}>
          <img
            src={imageURL ? imageURL : userImage}
            className=" object-cover object-center w-full h-full"
          />
        </div>
        <div className="w-full p-3 -mb-1 flex flex-col bg-darktheme-900">
          <CardContent classes={{ root: classes.content }}>
            <div className="w-full text-sm text-darktheme-100 truncate mb-1">
              {name + " " + lastname}
            </div>
            <div className="w-full text-sm text-darktheme-100 my-1 truncate">
              {email}
            </div>
            <div className="w-full text-sm text-darktheme-100 my-1 truncate">
              {mobile}
            </div>
            <div className="w-full font-sans text-sm text-darktheme-400 my-1 truncate">
              Joined : {moment(createdAt).format("DD/MM/YYYY")}
            </div>
            <div className="w-full font-sans text-sm text-darktheme-400 my-1 truncate">
              Last Updated : {moment(updatedAt).fromNow()}
            </div>
          </CardContent>
          {role === 0 && (
            <CardActions classes={{ root: classes.actions }}>
              <Button
                color="primary"
                variant="contained"
                classes={{ root: classes.promote }}
                onClick={() => promote(_id)}
              >
                Promote
              </Button>
              <Button
                variant="contained"
                classes={{ root: classes.deleteUser }}
                onClick={() => deleteUser(_id)}
              >
                Delete
              </Button>
            </CardActions>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserCard;
