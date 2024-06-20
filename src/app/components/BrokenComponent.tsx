"use client"; // Ensure this is a client component

import React from "react";

const BrokenComponent = () => {
  throw new Error("This is a simulated error.");
  return <div>This will not render.</div>;
};

export default BrokenComponent;
