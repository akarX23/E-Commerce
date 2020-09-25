import React, { Component } from "react";
import { connect } from "react-redux";
import {} from "../../actions/product_actions";
import { bindActionCreators } from "redux";

class Test extends Component {
  state = {
    images: [],
    imagePreviews: [],
  };

  onChange = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    let imagePreviews = [];

    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.push(e.target.result);
        if (i === files.length - 1) {
          this.setState({
            imagePreviews: [...this.state.imagePreviews, ...imagePreviews],
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  uploadImages = () => {
    // this.props.uploadImages(this.state.imagePreviews);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.product.images) {
      console.log(nextProps);
      this.setState({ images: nextProps.product.images.secure_url });
    }
  }

  render() {
    console.log(this.state.imagePreviews);
    return (
      <div>
        <br />
        <div className="col-sm-12">
          <h1>Image Uploader</h1>
          <hr />
          <div className="col-sm-4">
            <input
              className="form-control "
              type="file"
              onChange={this.onChange}
            />
          </div>
          <br />
          <br />
          <br />
          <div className="col-sm-4">
            <button
              className="btn btn-primary"
              value="Submit"
              onClick={this.uploadImages}
            >
              Submit
            </button>
          </div>
        </div>
        {this.state.imagePreviews.map((preview, i) => (
          <img
            src={preview}
            key={i}
            style={{ width: "300px" }}
            alt="product_image_review"
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    product: state.product,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Test);
