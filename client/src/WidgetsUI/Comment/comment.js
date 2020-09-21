import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { purple } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";
import { Rate } from "rsuite";
import Button from "@material-ui/core/Button";
import ThumbUpAltRoundedIcon from "@material-ui/icons/ThumbUpAltRounded";
import ThumbDownAltRoundedIcon from "@material-ui/icons/ThumbDownAltRounded";
import IconButton from "@material-ui/core/IconButton";

import moment from "moment";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: "30px",
    height: "30px",
    fontFamily: "serif",
    fontSize: "17px",
    marginRight: "10px",
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
  },
  commentControls: {
    color: "#fff",
    fontSize: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.07) !important",
    letterSpacing: "2px",
    outline: "none !important",
    border: "none !important",
    marginRight: "20px",
  },
  likeControls: {
    color: "#454B51",
    outline: "none !important",
    border: "none !important",
    marginRight: "8px",
  },
  filledLikedControls: {
    color: "#2b6cb0 !important",
  },
}));

const Comment = ({
  userInfo,
  updatedAt,
  comment,
  rating,
  userComment,
  openReviewEdit,
  openReviewDelete,
  liked,
  disliked,
  sendCommentLikeRequest,
  likes,
  dislikes,
}) => {
  const classes = useStyles();

  return (
    <div className="flex w-full mt-4 items-start justify-start">
      <Avatar
        classes={{
          root: classes.avatar,
        }}
      >
        {userInfo.name[0]}
      </Avatar>
      <div className="flex-grow flex flex-col">
        <div className="flex w-full items-baseline justify-between">
          <div className="text-base mr-2 text-darktheme-300 font-serif">
            {userComment === true
              ? "You"
              : userInfo.name + " " + userInfo.lastname}
          </div>
          <div className="text-sm mr-2 text-darktheme-500">
            {moment(updatedAt).fromNow()}
          </div>
        </div>
        <Rate allowHalf value={rating} readOnly color="yellow" size="xs" />
        <div className="w-full h-auto text-base text-darktheme-200 font-sans">
          {comment}
        </div>
        {userComment === true ? (
          <div className="flex mt-2">
            <Button
              size="medium"
              classes={{ root: classes.commentControls }}
              onClick={openReviewEdit}
            >
              EDIT
            </Button>
            <Button
              size="medium"
              classes={{ root: classes.commentControls }}
              onClick={openReviewDelete}
            >
              DELETE
            </Button>
          </div>
        ) : (
          <div className="flex mt-2 w-2/5 justify-between">
            <div className="flex items-center mr-2">
              <IconButton
                classes={{
                  root: `${classes.likeControls} ${
                    liked === true ? classes.filledLikedControls : ""
                  }`,
                }}
                onClick={() => sendCommentLikeRequest("liked")}
              >
                <ThumbUpAltRoundedIcon fontSize="small" />
              </IconButton>
              <div className="text-darktheme-300 text-sm">{likes}</div>
            </div>
            <div className="flex items-center">
              <IconButton
                classes={{
                  root: `${classes.likeControls} ${
                    disliked === true ? classes.filledLikedControls : ""
                  }`,
                }}
                onClick={() => sendCommentLikeRequest("disliked")}
              >
                <ThumbDownAltRoundedIcon fontSize="small" />
              </IconButton>
              <div className="text-darktheme-300 text-sm">{dislikes}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
