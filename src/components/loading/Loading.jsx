import React from "react";
import { StyledWrapper } from "../../styles/Loader";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="loader__circle" />
        <div className="loader__circle" />
        <div className="loader__circle" />
        <div className="loader__circle" />
        <div className="loader__circle" />
      </div>
    </StyledWrapper>
  );
};

export default Loader;
