"use client"

import React from "react";

const page = () => {
  // Redirect to /[lang]/dashboard
  React.useEffect(() => {
    window.location.href = `/${window.location.pathname.split('/')[1]}/dashboard`;
  }, []);
  
  return null;
};

export default page;