import React, { Component } from "react";
import Input from "../../WidgetsUI/Input/input";
import Fade from "react-reveal/Fade";
import "./signUpForm.css";

class SignUpForm extends Component {
  state = {
    values: {
      email: "",
      password: "",
      name: "",
      lastname: "",
      mobile: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    info: {
      email: "We will never share your email address.",
      password: "Password should be at least 5 characters.",
    },
    valid: {
      email: false,
      password: false,
      name: false,
      lastname: false,
      mobile: false,
      pincode: true,
      street: true,
      state: true,
      city: true,
    },
    config: {
      email: { type: "text", placeholder: "Enter email" },
      password: { type: "password", placeholder: "Enter password" },
      name: { type: "text", placeholder: "Enter name" },
      lastname: { type: "text", placeholder: "Enter lastname" },
      mobile: { type: "text", placeholder: "Mobile" },
      street: { type: "text", placeholder: "Street" },
      city: { type: "text", placeholder: "City" },
      state: { type: "text", placeholder: "State" },
      pincode: { type: "text", placeholder: "Pincode" },
    },
    label: {
      email: "Email",
      password: "Password",
      name: "Name",
      lastname: "Last Name",
      mobile: "Mobile",
      street: "Street",
      city: "City",
      state: "State",
      pincode: "Pincode",
    },
    errorMessage: {
      email: "",
      password: "",
      name: "",
      lastname: "",
      mobile: "",
    },
    icon: {
      email: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="mail w-6 h-6">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      password: (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="lock-closed w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
      name: (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="identification w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      lastname: (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="identification w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      mobile: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="phone w-6 h-6">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      ),
      street: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="map w-4 h-full">
          <path
            fillRule="evenodd"
            d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
            clipRule="evenodd"
          />
        </svg>
      ),
      state: (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="office-building w-4 h-full"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      city: (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="library w-4 h-full"
        >
          <path
            fillRule="evenodd"
            d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      pincode: (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="location-marker w-4 h-full"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    validate: {
      email: true,
      password: true,
      name: true,
      lastname: true,
      mobile: true,
      street: false,
      city: false,
      state: false,
      pincode: false,
    },
  };

  handleInputChange = (inputName, value) => {
    let { newerrorMessage, newValid, newValue } = this.validateInputs(
      inputName,
      value
    );
    this.setState({
      values: newValue,
      errorMessage: newerrorMessage,
      valid: newValid,
    });
  };

  validateInputs = (inputName, value) => {
    let newerrorMessage = { ...this.state.errorMessage };
    let newValid = { ...this.state.valid };
    let newValue = { ...this.state.values };

    if (this.state.validate[inputName] === false) {
      if (
        inputName === "pincode" &&
        (isNaN(value) || value.length !== 6) &&
        value !== ""
      ) {
        newValid[inputName] = false;
      } else {
        newValid[inputName] = true;
      }
      return { newerrorMessage, newValid, newValue };
    } else {
      newerrorMessage[inputName] = "";
      newValid[inputName] = true;
      newValue[inputName] = value;

      if (value === "") {
        newerrorMessage[inputName] = "*This field is required";
        newValid[inputName] = false;
      } else if (
        inputName === "email" &&
        !RegExp(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ).test(value)
      ) {
        newerrorMessage[inputName] = "Email not valid";
        newValid[inputName] = false;
      } else if (inputName === "password" && value.length < 5) {
        newerrorMessage[inputName] = "Password too short";
        newValid[inputName] = false;
      } else if (
        inputName === "mobile" &&
        (isNaN(value) || value.length !== 10)
      ) {
        newerrorMessage[inputName] = "Phone Number not Valid";
        newValid[inputName] = false;
      }
      return { newerrorMessage, newValid, newValue };
    }
  };

  submitForm = (e) => {
    e.preventDefault();
    let newerrorMessage = { ...this.state.errorMessage };
    let formValid = true;

    Object.keys(this.state.valid).forEach((key) => {
      if (
        this.state.validate[key] === true &&
        this.state.valid[key] === false
      ) {
        if (this.state.errorMessage[key] === "")
          newerrorMessage[key] = "*This field is required";
        formValid = false;
      }
    });
    if (!formValid) this.setState({ errorMessage: newerrorMessage });

    if (formValid) {
      this.props.signup(this.state.values);
    }
  };

  render() {
    return (
      <>
        <div
          className="text-sm text-blue-400 hover:underline form-toggle cursor-pointer"
          onClick={() => this.props.changeForm()}
        >
          Already a user? Log In here.
        </div>
        <form onSubmit={(e) => this.submitForm(e)}>
          <div className="flex flex-col justify-evenly items-center p-2 pl-4 h-auto w-auto">
            <Input
              label={this.state.label.email}
              info={this.state.info.email}
              icon={this.state.icon.email}
              valid={this.state.valid.email}
              errorMessage={this.state.errorMessage.email}
              value={this.state.values.email}
              config={this.state.config.email}
              validate={true}
              onchange={(event) =>
                this.handleInputChange("email", event.target.value)
              }
            />
            <Input
              label={this.state.label.password}
              info={this.state.info.password}
              icon={this.state.icon.password}
              valid={this.state.valid.password}
              errorMessage={this.state.errorMessage.password}
              value={this.state.values.password}
              config={this.state.config.password}
              validate={true}
              onchange={(event) =>
                this.handleInputChange("password", event.target.value)
              }
            />
            <Input
              label={this.state.label.name}
              info={this.state.info.name}
              icon={this.state.icon.name}
              valid={this.state.valid.name}
              errorMessage={this.state.errorMessage.name}
              value={this.state.values.name}
              config={this.state.config.name}
              validate={true}
              onchange={(event) =>
                this.handleInputChange("name", event.target.value)
              }
            />
            <Input
              label={this.state.label.lastname}
              info={this.state.info.lastname}
              icon={this.state.icon.lastname}
              valid={this.state.valid.lastname}
              errorMessage={this.state.errorMessage.lastname}
              value={this.state.values.lastname}
              config={this.state.config.lastname}
              validate={true}
              onchange={(event) =>
                this.handleInputChange("lastname", event.target.value)
              }
            />
            <Input
              label={this.state.label.mobile}
              info={this.state.info.mobile}
              icon={this.state.icon.mobile}
              valid={this.state.valid.mobile}
              errorMessage={this.state.errorMessage.mobile}
              value={this.state.values.mobile}
              config={this.state.config.mobile}
              validate={true}
              onchange={(event) =>
                this.handleInputChange("mobile", event.target.value)
              }
            />

            <div className="flex w-full flex-wrap">
              <div className="md:w-3/5 w-full">
                <Input
                  label={this.state.label.street}
                  info={this.state.info.street}
                  icon={this.state.icon.street}
                  valid={this.state.valid.street}
                  errorMessage={this.state.errorMessage.street}
                  value={this.state.values.street}
                  config={this.state.config.street}
                  validate={false}
                  onchange={(event) =>
                    this.handleInputChange("street", event.target.value)
                  }
                />
              </div>
              <div className="md:w-2/5 w-full">
                <Input
                  label={this.state.label.city}
                  info={this.state.info.city}
                  icon={this.state.icon.city}
                  valid={this.state.valid.city}
                  errorMessage={this.state.errorMessage.city}
                  value={this.state.values.city}
                  config={this.state.config.city}
                  validate={false}
                  onchange={(event) =>
                    this.handleInputChange("city", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex w-full flex-wrap">
              <div className="md:w-1/2 w-full">
                <Input
                  label={this.state.label.state}
                  info={this.state.info.state}
                  icon={this.state.icon.state}
                  valid={this.state.valid.state}
                  errorMessage={this.state.errorMessage.state}
                  value={this.state.values.state}
                  config={this.state.config.state}
                  validate={false}
                  onchange={(event) =>
                    this.handleInputChange("state", event.target.value)
                  }
                />
              </div>
              <div className="md:w-1/2 w-full">
                <Input
                  label={this.state.label.pincode}
                  info={this.state.info.pincode}
                  icon={this.state.icon.pincode}
                  state
                  valid={this.state.valid.pincode}
                  errorMessage={this.state.errorMessage.pincode}
                  value={this.state.values.pincode}
                  config={this.state.config.pincode}
                  validate={false}
                  onchange={(event) =>
                    this.handleInputChange("pincode", event.target.value)
                  }
                />
              </div>
            </div>
            <Fade bottom duration={1000}>
              <div className="text-gray-400 text-xs text-left box-border">
                Address fields optional. Invalid values will be discarded. You
                can add multiple addresses later.
              </div>
              <button
                type="submit"
                className="py-2 px-4 submit text-base my-2 bg-darktheme-800 rounded-lg w-auto hover:bg-gray-100 sign-up transition-all duration-300 font-bold"
              >
                {this.state.loading ? (
                  <div className="loading"></div>
                ) : (
                  "Sign Up!"
                )}
              </button>
              <p className="text-black font-bold font-serif">
                An email will be sent to you for confirmation.
              </p>
            </Fade>
          </div>
        </form>
      </>
    );
  }
}

export default SignUpForm;
