import React from "react";
import { CSSTransition } from "react-transition-group";
import "./modal.css";

const Modal = (props) => {
  return (
    <>
      <div className={`backdrop ${props.showModal ? "" : "hidden"} z-30`}></div>

      <CSSTransition
        in={props.showModal}
        timeout={300}
        classNames="modal"
        unmountOnExit
      >
        <div
          className="fixed z-30 inset-0 flex items-center justify-center"
          onClick={() => props.hideModal()}
        >
          <div
            className="bg-darktheme-700 w-full md:w-1/2 h-4/5 lg:w-3/5 xl:w-2/5 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`modal-header flex justify-between font-bold text-3xl border-darktheme-800 border-b pb-2 text-black m-3 mb-1 box-border`}
            >
              {props.title ? props.title : <div></div>}
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="x-circle w-6 h-6 text-black cursor-pointer transform hover:scale-150 transition-all duration-150"
                onClick={() => props.hideModal()}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="modal-body w-full overscroll-contain custom-scrollbar overflow-auto scrolling-touch text-center">
              {props.children}
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default Modal;
