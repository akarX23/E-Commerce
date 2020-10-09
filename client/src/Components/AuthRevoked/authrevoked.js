import React from "react";
import PageNotFound from "../../WidgetsUI/PageNotFound/pageNotFound";

const AuthRevoked = () => {
  return (
    <div className="mt-8">
      <PageNotFound message="You are not authorised to visit this page!" />
    </div>
  );
};

export default AuthRevoked;
