import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import BackupIcon from "@material-ui/icons/Backup";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import AutorenewIcon from "@material-ui/icons/Autorenew";

const useStyles = makeStyles((theme) => ({
  upload: {
    width: "150px",
    outline: "none !important",
    border: "none !important",
  },
  input: {
    display: "none",
  },
  save: {
    outline: "none !important",
    border: "none !important",
    width: "150px",
    [theme.breakpoints.up(420)]: {
      marginTop: "30px",
      marginRight: "30px",
    },
    [theme.breakpoints.down(420)]: {
      marginBottom: "30px",
    },
    backgroundColor: "#48bb78",
    "&:hover": {
      backgroundColor: "#2f855a",
    },
    color: "white",
  },
}));

const UserImageUpload = ({ image, onChangeImage, file }) => {
  const classes = useStyles();

  const types = ["image/png", "image/jpeg", "image/gif"];

  const [imageRendering, setImageRendering] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");

  const onChange = (e) => {
    const file = Array.from(e.target.files);
    if (file.length > 0) getFileData(file[0]);
  };

  const getFileData = (newFile) => {
    let imagePreview = null;

    if (types.includes(newFile.type) === false) {
      setShowAlert(true);
      setAlert("Invalid file type discarded.");
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview = reader.result;
      };
      reader.onloadstart = (e) => setImageRendering(true);
      reader.onloadend = (e) => {
        onChangeImage(imagePreview, newFile);
        setImageRendering(false);
      };
      reader.onerror = (error) => console.log(error);
      reader.readAsDataURL(newFile);
    }
  };

  return (
    <div className="flex flex-col mb:items-start items-center mb:flex-row justify-center mb:justify-start">
      <div className="flex mbmax:flex-row flex-col items-start">
        <div>
          <input
            accept="image/*"
            className={classes.input}
            id="userImage"
            type="file"
            onChange={(event) => onChange(event)}
          />
          <label htmlFor="userImage">
            <Button
              color="primary"
              variant="contained"
              classes={{ root: classes.upload }}
              startIcon={<BackupIcon fontSize="large" />}
              component="span"
              endIcon={imageRendering && <AutorenewIcon />}
            >
              {file || image ? "Change" : "Upload"}
            </Button>
          </label>
        </div>
      </div>
      <Snackbar
        open={showAlert === true}
        autoHideDuration={6000}
        onClose={() => {
          setShowAlert(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          onClose={() => {
            setShowAlert(false);
          }}
          severity="error"
        >
          {alert}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserImageUpload;
