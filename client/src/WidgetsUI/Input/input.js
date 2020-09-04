import React from "react";
import "./input.css";
import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import Fade from "react-reveal/Fade";
import Slide from "react-reveal/Slide";

const Input = ({
  label,
  info,
  icon,
  valid,
  errorMessage,
  value,
  options,
  config,
  validate,
  ...rest
}) => {
  const [passvisible, setPassVisiblity] = useState(false);

  const setVisbility = () => {
    setPassVisiblity(!passvisible);
  };

  const renderInput = () => {
    switch (config.type) {
      case "select":
        return (
          <select
            onChange={rest.onchange}
            {...config}
            value={value}
            className={`input bg-darktheme-800 text-lg text-white font-bold ${
              icon ? "input-with-icons" : ""
            }`}
          >
            {options.map((item, i) => {
              return (
                <option value={item} key={i}>
                  {item}
                </option>
              );
            })}
          </select>
        );
      case "textarea":
        return (
          <textarea
            onChange={rest.onchange}
            value={value}
            {...config}
            className={`input custom-scrollbar resize-none break-words h-full bg-darktheme-800 text-lg text-white ${
              icon ? "input-with-icons" : ""
            }`}
          />
        );
      case "password":
        return (
          <>
            <input
              onChange={rest.onchange}
              placeholder={config.placeholder}
              type={passvisible ? "text" : "password"}
              className={`input bg-darktheme-800 pl-3 text-lg text-white placeholder-darktheme-500 ${
                icon ? "input-with-icons" : ""
              }`}
              autoComplete="true"
            />
            <div
              className={`h-full w-auto p-1 box-border bg-darktheme-800 absolute cursor-pointer right-0 my-auto`}
              onClick={() => {
                setVisbility();
              }}
            >
              <Slide up when={passvisible} duration={300} collapse>
                <div>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="eye w-6 h-full text-blue-500"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </Slide>
              <Slide up when={!passvisible} duration={300} collapse>
                <div>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="eye-off w-6 h-full text-blue-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                </div>
              </Slide>
            </div>
          </>
        );
      default:
        return (
          <input
            onChange={rest.onchange}
            {...config}
            className={`input bg-darktheme-800 pl-3 ${
              rest.small ? "text-sm" : "text-lg"
            } text-white placeholder-darktheme-500 ${
              icon ? "input-with-icons" : ""
            }`}
            autoComplete="true"
          />
        );
    }
  };

  const getValidateIcons = () => {
    return (
      <div className="relative w-full h-full">
        <CSSTransition
          in={valid === false && errorMessage !== "" && validate === true}
          timeout={500}
          classNames="error-icon"
          unmountOnExit
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="text-red-1100 fill-current absolute inset-0"
          >
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z" />
          </svg>
        </CSSTransition>
        <CSSTransition
          in={valid === true && validate === true}
          timeout={500}
          classNames="validated-icon"
          unmountOnExit
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="check-circle text-green-400 bsolute inset-0"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </CSSTransition>
      </div>
    );
  };

  return (
    <Fade bottom duration={1000}>
      <div className="w-full h-full flex flex-col font-mono items-start justify-center mb-4">
        {label ? (
          <div className="text-base text-gray-400 tracking-widest mb-1">
            {label}
          </div>
        ) : null}
        <div className="h-auto w-full flex items-center">
          <div
            className={`flex flex-grow border-2 relative ${
              errorMessage || (validate === false && valid === false)
                ? "border-red-1000"
                : valid
                ? "border-green-600"
                : "border-white-600"
            } transition-all duration-500 rounded-lg overflow-hidden`}
          >
            {icon ? (
              <div
                className={`p-1 ${
                  errorMessage || (validate === false && valid === false)
                    ? "bg-red-1000"
                    : valid
                    ? "bg-green-500"
                    : "bg-gray-500"
                } text-black box-border w-auto h-auto`}
              >
                {icon}
              </div>
            ) : null}
            {renderInput()}
          </div>
          <div className="p-1 w-8 box-border h-8">{getValidateIcons()}</div>
        </div>
        <div className="text-xs text-gray-400 box-border">{info}</div>
        <Fade
          when={errorMessage !== ""}
          bottom
          collapse
          duration={400}
          cascade
          fraction={0}
        >
          <div
            className={`text-xsm text-red-1100 mb-2 tracking-wider italic font-sans font-base ${
              info ? "" : "pt-1"
            }`}
          >
            {errorMessage}
          </div>
        </Fade>
      </div>
    </Fade>
  );
};

export default Input;
