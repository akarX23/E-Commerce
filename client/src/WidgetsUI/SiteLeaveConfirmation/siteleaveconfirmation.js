import React from "react";
import NavigationPrompt from "react-router-navigation-prompt";
import Modal from "../Modal/modal";
import Button from "@material-ui/core/Button";

const SiteLeaveConfirmation = ({
  confirm,
  cancel,
  title,
  confirmOption,
  cancleOption,
  when,
}) => {
  return (
    <>
      <NavigationPrompt when={when}>
        {({ onConfirm, onCancel }) => (
          <Modal showModal={true} title={title}>
            <Button
              color="primary"
              onClick={() => {
                onConfirm();
                confirm();
              }}
            >
              {confirmOption}
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                onCancel();
                cancel();
              }}
            >
              {cancleOption}
            </Button>
          </Modal>
        )}
      </NavigationPrompt>
    </>
  );
};

export default SiteLeaveConfirmation;
