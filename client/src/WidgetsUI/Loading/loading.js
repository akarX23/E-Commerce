import React from "react";

const Loading = () => {
  return (
    <>
      <div className="backdrop z-10"></div>
      <div className="fixed inset-0 flex items-center justify-center z-30">
        <div className="loading">B2mE</div>
      </div>
    </>
  );
};

export default Loading;
