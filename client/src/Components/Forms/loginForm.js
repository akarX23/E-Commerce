import React, { Component } from "react";
import Input from "../../WidgetsUI/Input/input";

import "./loginForm.css";
import { Link } from "react-router-dom";
import Fade from "react-reveal/Fade";

class LoginForm extends Component {
  state = {
    values: { email: "", password: "" },
    info: {
      email: "We will never share your email address.",
      password: "Password should be at least 5 characters.",
    },
    valid: { email: false, password: false },
    config: {
      email: { type: "text", placeholder: "Enter email" },
      password: { type: "password", placeholder: "Enter password" },
    },
    label: { email: "Email", password: "Password" },
    errorMessage: { email: "", password: "" },
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
    },
  };

  handleInputChange = (inputName, value) => {
    let newValue = { ...this.state.values };
    newValue[inputName] = value;
    let { newerrorMessage, newValid } = this.validateInputs(inputName, value);

    this.setState({
      values: newValue,
      errorMessage: newerrorMessage,
      valid: newValid,
    });
  };

  validateInputs = (inputName, value) => {
    let newerrorMessage = { ...this.state.errorMessage };
    let newValid = { ...this.state.valid };

    newerrorMessage[inputName] = "";
    newValid[inputName] = true;

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
    }

    return { newerrorMessage, newValid };
  };

  submitForm = (e) => {
    e.preventDefault();
    let newerrorMessage = { ...this.state.errorMessage };
    let formValid = true;

    Object.keys(this.state.valid).forEach((key) => {
      if (this.state.valid[key] === false) {
        if (this.state.errorMessage[key] === "")
          newerrorMessage[key] = "*This field is required";
        formValid = false;
      }
    });
    if (!formValid) this.setState({ errorMessage: newerrorMessage });

    if (formValid) {
      this.props.login(this.state.values);
    }
  };

  render() {
    return (
      <>
        <div
          className="text-sm text-blue-400 hover:underline form-toggle cursor-pointer"
          onClick={() => this.props.changeForm()}
        >
          New User? Sign Up Now!
        </div>
        <form onSubmit={(e) => this.submitForm(e)}>
          <div className="flex flex-col justify-evenly items-center box-border p-2 pl-4 h-auto w-auto overflow-hidden">
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

            <div className="w-full text-center flex justify-evenly">
              <Fade bottom collapse duration={600}>
                <button
                  type="submit"
                  className="py-2 px-4 submit text-base my-2 bg-darktheme-800 rounded-lg w-auto hover:bg-gray-100 sign-up transition-all duration-300 font-bold"
                >
                  {this.state.loading ? (
                    <div className="loading"></div>
                  ) : (
                    "Log In!"
                  )}
                </button>
              </Fade>
              <Fade bottom collapse duration={1200}>
                <Link to="/user/forgot" className="">
                  <p
                    className="text-xs text-blue-400 hover:underline"
                    onClick={() => this.props.hideModal()}
                  >
                    Forgot Password?
                  </p>
                </Link>
              </Fade>
            </div>
          </div>
        </form>
      </>
    );
  }
}

export default LoginForm;
