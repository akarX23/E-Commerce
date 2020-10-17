import React from "react";

import "./loading.css";

const Loading = () => {
  return (
    <>
      <div className="backdrop z-50"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="loading">B2mE</div>
      </div>
    </>
  );
};

export default Loading;
