import React from "react";
import { StyledWrapper } from "../../styles/SmallLoader";

const SmallLoader = () => {
  return (
    <StyledWrapper>
      <div className="dot-spinner">
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
      </div>
    </StyledWrapper>
  );
};

export default SmallLoader;
