import React, { Component } from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./draganddrop.css";

class DragAndDrop extends Component {
  state = {
    drag: false,
  };

  dropRef = React.createRef();

  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ drag: true });
    }
  };
  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.setState({ drag: false });
    }
  };
  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ drag: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };

  componentDidMount() {
    let div = this.dropRef.current;
    this.dragCounter = 0;
    div.addEventListener("dragenter", this.handleDragIn);
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);
  }
  componentWillUnmount() {
    let div = this.dropRef.current;
    div.removeEventListener("dragenter", this.handleDragIn);
    div.removeEventListener("dragleave", this.handleDragOut);
    div.removeEventListener("dragover", this.handleDrag);
    div.removeEventListener("drop", this.handleDrop);
  }

  render() {
    return (
      <div className="relative w-full h-full" ref={this.dropRef}>
        {(this.props.dropped === false || this.state.drag === true) && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center ${
              this.state.drag === true &&
              "z-20 border-dashed border-4 border-darktheme-400 bg-darktheme-900 bg-opacity-75"
            } `}
          >
            <div className={`${this.state.drag === true && "float"} -mt-32`}>
              <CloudUploadIcon style={{ fontSize: 60, color: "white" }} />
            </div>
            <div className="text-white font-mono tracking-wide">
              DROP YOUR FILES HERE :)
            </div>
          </div>
        )}
        <div className="p-3 overflow-auto w-full h-full bg-darktheme-900 bg-opacity-25 rounded-lg">
          {this.props.children}
        </div>
        {this.props.reading && (
          <div className="absolute inset-0 z-20 bg-darktheme-900 bg-opacity-75 flex flex-col items-center justify-center">
            <CircularProgress
              color="primary"
              disableShrink
              size={40}
              thickness={4}
            />
            <div className="text-xl font-medium text-darktheme-200">
              Reading files
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default DragAndDrop;
