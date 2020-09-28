import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import BackupIcon from "@material-ui/icons/Backup";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import DragAndDrop from "../../WidgetsUI/DragAndDrop/draganddrop";
import UploadImageCard from "../../WidgetsUI/UploadImageCard/uploadimagecard";

const useStyles = makeStyles((theme) => ({
  prevStep: {
    outline: "none !important",
    border: "none !important",
  },
  nextStep: {
    outline: "none !important",
    border: "none !important",
    backgroundColor: "#38a169",
    marginLeft: "20px",
    color: "white",
    "&:hover": {
      backgroundColor: "#2f855a",
    },
  },
  input: {
    display: "none",
  },
  upload: {
    backgroundColor: "#33383D !important",
    color: "#DDE1E6",
    font: "sans",
    marginRight: "10px",
  },
  dragaAndDropContainer: {
    width: "100%",
    height: "600px",
    paddingLeft: "3px",
    paddingRight: "3px",
  },
}));

const ImageAdd = ({ imageData, fileData, stepChange }) => {
  const classes = useStyles();

  const types = ["image/png", "image/jpeg", "image/gif"];

  const [images, setImages] = useState([...imageData]);
  const [files, setFiles] = useState([...fileData]);
  const [error, setError] = useState("");

  const changeStep = (changeInStep) => {
    if (images.length === 0)
      setError("At least one file needs to be selected.");
    else stepChange(images, files, changeInStep);
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    try {
      getFileData(files);
    } catch (error) {
      console.log(error);
    }
  };

  const getFileData = (newFiles) => {
    let imagePreviews = [];
    newFiles = newFiles.filter((file, i) => {
      if (types.includes(file.type) === false) {
        setError("Invalid file type discarded.");
        return false;
      }
      return true;
    });

    if (files.length + newFiles.length > 12) {
      setError("Maximum 12 images allowed.");
      newFiles = newFiles.slice(0, 12 - files.length);
    }

    newFiles.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.push(reader.result);
        if (i === newFiles.length - 1) {
          setImages([...images, ...imagePreviews]);
          setFiles([...files, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (index) => {
    let newFiles = [...files];
    let newImages = [...images];

    newFiles = newFiles.filter((file, i) => i !== index);
    newImages = newImages.filter((image, i) => i !== index);

    setFiles([...newFiles]);
    setImages([...newImages]);
  };

  const getDraggedFiles = (files) => {
    getFileData(files);
  };

  return (
    <>
      <div className="mx-auto w-full">
        <div className="flex w-full mt-3 px-6 justify-end">
          <Button
            variant="contained"
            classes={{ root: classes.prevStep }}
            startIcon={<ChevronLeftIcon />}
            onClick={() => changeStep(-1)}
            color="primary"
          >
            BACK
          </Button>
          <Button
            variant="contained"
            classes={{ root: classes.nextStep }}
            endIcon={<ChevronRightIcon />}
            onClick={() => changeStep(1)}
          >
            NEXT
          </Button>
        </div>
        <div className="px-6 flex flex-col mb:flex-row mt-4 mb:mt-0">
          <input
            accept="image/*"
            className={classes.input}
            id="productImages"
            multiple
            type="file"
            onChange={(event) => onChange(event)}
          />
          <label htmlFor="productImages">
            <Button
              variant="contained"
              classes={{ root: classes.upload }}
              component="span"
              startIcon={<BackupIcon fontSize="large" />}
            >
              Upload
            </Button>
          </label>
          <div className="mb-1 mb:mb-0 text-xs mb:text-sm font-sans text-darktheme-200">
            Your images will show up below. You can click on an image to delete
            it.
          </div>
        </div>
        <div className={classes.dragaAndDropContainer}>
          <DragAndDrop
            handleDrop={(files) => getDraggedFiles(files)}
            dropped={images.length > 0}
          >
            <div className="mx-auto w-full grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-6">
              {files.map((file, i) => (
                <UploadImageCard
                  key={i}
                  file={file}
                  image={images[i]}
                  deleteImage={() => handleDeleteImage(i)}
                />
              ))}
            </div>
          </DragAndDrop>
        </div>
      </div>
      <Snackbar
        open={error !== ""}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert variant="filled" onClose={() => setError("")} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ImageAdd;
